import * as Bluebird from 'bluebird';
import * as puppeteer from 'puppeteer';

import { AdapterResult } from './adapters/adapter-result.interface';
import { Adapter } from './adapters/adapter.interface';
import { MediaExpertAdapter } from './adapters/media-expert.adapter';
import { Channel } from './communication-channels/channel.interface';
import { SerwerSMSChannel } from './communication-channels/serwer-sms.channel';
import { logger } from './logger';

const CONCURRENCY = 2;

const SMS_SERWER_USERNAME = process.env.SMS_SERWER_USERNAME;
const SMS_SERWER_PASSWORD = process.env.SMS_SERWER_PASSWORD;
const SMS_SERWER_NUMBER = process.env.SMS_SERWER_NUMBER;
const DEBUG = process.env.DEBUG === 'true';

(async () => {
  const browser = await puppeteer.launch();
  const adapters: Adapter[] = [
    new MediaExpertAdapter(browser)
  ];
  const communicationChannels: Channel[] = [
    new SerwerSMSChannel(
      SMS_SERWER_USERNAME,
      SMS_SERWER_PASSWORD,
      SMS_SERWER_NUMBER,
      DEBUG,
    ),
  ];
  await processor(adapters, communicationChannels, CONCURRENCY);
})();

async function processor(adapters: Adapter[], communicationChannels: Channel[], maxConcurrency: number = 2) {
  while (true) {
    const results = await checkAllAdapters(adapters, maxConcurrency);
    const availableResults = results.filter(({ available }) => available);
    logger.info(`There are ${availableResults.length} out of ${results.length} sites with PS5 available.`);

    if (availableResults.length > 0) {
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
