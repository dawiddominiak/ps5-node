import axios from 'axios';

import { AdapterResult } from '../adapters/adapter-result.interface';
import { logger } from '../logger';
import { Channel } from './channel.interface';

const SENDER = 'INFO';
const URL = 'https://api2.serwersms.pl/messages/send_sms';

export class SerwerSMSChannel implements Channel {
  constructor(
    private readonly username: string,
    private readonly password: string,
    private readonly phone: string,
    private readonly debug: boolean = false,
  ) { }

  public get name() : string {
    return 'Serwer SMS';
  }

  public async communicate(results: AdapterResult[]): Promise<void> {
    const infos = results.map(result => `- ${result.name} ("${result.message}" - ${result.link})\n`)

    const response = await axios.post(URL, {
      username: this.username,
      password: this.password,
      phone: this.phone,
      sender: SENDER,
      text: `PS 5 available:\n${infos}`,
      test: this.debug,
    });

    logger.info(`Text message has been sent to ${this.phone}.`, response.data);
  }

}
