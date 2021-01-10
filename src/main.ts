import * as Bluebird from 'bluebird';
import * as puppeteer from 'puppeteer';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';

import { AdapterResult } from './adapters/adapter-result.interface';
import { Adapter } from './adapters/adapter.interface';
import { AmazonAdapter } from './adapters/amazon.adapter';
import { EmpikAdapter } from './adapters/empik.adapter';
import { EuroAdapter } from './adapters/euro.adapter';
import { KomputronikAdapter } from './adapters/komputronik.adapter';
import { MediaExpertAdapter } from './adapters/media-expert.adapter';
import { NeonetAdapter } from './adapters/neonet.adapter';
import { OleOleAdapter } from './adapters/oleole.adapter';
import { Channel } from './communication-channels/channel.interface';
import { SerwerSMSChannel } from './communication-channels/serwer-sms.channel';
import { logger } from './logger';
import { Repository } from './repository';

const CONCURRENCY = 2;

const SMS_SERWER_USERNAME = process.env.SMS_SERWER_USERNAME;
const SMS_SERWER_PASSWORD = process.env.SMS_SERWER_PASSWORD;
const SMS_SERWER_NUMBER = process.env.SMS_SERWER_NUMBER;
const DEBUG = process.env.DEBUG === 'true';

(async () => {
  try {
    const db = await open<sqlite3.Database, sqlite3.Statement>({
      filename: './sqlite.db',
      driver: sqlite3.Database,
    });
    const repository = new Repository(db);
    await repository.init();
    const browser = await puppeteer.launch();
    const adapters: Adapter[] = [
      new MediaExpertAdapter(browser),
      new KomputronikAdapter(browser),
      new EuroAdapter(browser),
      new NeonetAdapter(browser),
      new OleOleAdapter(browser),
      new EmpikAdapter(browser),
      new AmazonAdapter(browser),
    ];
    const communicationChannels: Channel[] = [
      new SerwerSMSChannel(
        SMS_SERWER_USERNAME,
        SMS_SERWER_PASSWORD,
        SMS_SERWER_NUMBER,
        DEBUG,
      ),
    ];
    await processor(adapters, communicationChannels, repository, CONCURRENCY);
  } catch (error) {
    logger.error('Unexpected error: ', error);
    process.exit(1);
  }
})();

async function processor(adapters: Adapter[], communicationChannels: Channel[], repository: Repository, maxConcurrency: number = 2) {
  while (true) {
    const results = await checkAllAdapters(adapters, maxConcurrency);
    const availableResults = results
      .filter(({ available }) => available);
    logger.info(`There are ${availableResults.length} out of ${results.length} sites with PS5 available.`);

    const resultsToSendMessageTo = await Bluebird.filter(
      availableResults,
      async ({ name }) => !(await repository.wasAvailableInTheLast2Min(name)),
    );
    logger.info(`There are ${resultsToSendMessageTo.length} out of ${results.length} sites worth to inform about.`);

    await Bluebird.map(resultsToSendMessageTo, result => repository.save(result), { concurrency: 1 });
    logger.info(`Saving ${resultsToSendMessageTo.length} available results to the repository.`);

    if (resultsToSendMessageTo.length > 0) {
      await Bluebird.map(
        communicationChannels,
        async channel => {
          try {
            logger.info(`Trying to communicate availability using ${channel.name} communication channel.`);

            return await channel.communicate(availableResults);
          } catch (error) {
            logger.error(`Communication channel "${channel.name}" thrown an error: `, error);
          }
        },
        { concurrency: maxConcurrency }
      );
    }
  }
}

async function checkAllAdapters(adapters: Adapter[], maxConcurrency: number = 2): Promise<AdapterResult[]> {
  logger.info('Checking all adapters.');

  return Bluebird.map(
    adapters,
    async adapter => {
      try {
        logger.info(`Checking ${adapter.name} adapter.`);
        const result = await adapter.checkAvailability();
        logger.info(`${adapter.name} text: "${result.message}" (${Buffer.from(result.message).toString('base64')}).`);

        return result;
      } catch (error) {
        logger.error(`${adapter.name} adapter thrown an error: `, error);

        return {
          available: false,
          message: `${adapter.name} adapter thrown an error: ${(error as Error).message}.`,
          date: new Date(),
          name: adapter.name,
        };
      }
    },
    {
      concurrency: maxConcurrency,
    }
  );
}
