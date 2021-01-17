import * as sgMail from '@sendgrid/mail';

import { AdapterResult } from '../adapters/adapter-result.interface';
import { logger } from '../logger';
import { Channel } from './channel.interface';

export class SendgridChannel implements Channel {
  constructor(
    sendgridApiKey: string,
    private readonly email: string
  ) {
    sgMail.setApiKey(sendgridApiKey);
  }

  public get name() : string {
    return 'Sendgrid email';
  }

  public async communicate(results: AdapterResult[]): Promise<void> {
    const infos = results.map(result => `- ${result.name} ("${result.message}" - ${result.link})\n`);

    const response = await sgMail.send({
      to: this.email,
      from: this.email,
      subject: 'PS5 availability alert',
      text: `PS 5 available:\n${infos}`,
      html: `PS 5 available:\n${infos}`
    });

    logger.info(`Email message has been sent to ${this.email}.`, response);
  }
}
