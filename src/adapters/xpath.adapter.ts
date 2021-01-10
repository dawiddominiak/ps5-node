import { Browser, Page } from 'puppeteer';

import { AdapterResult } from './adapter-result.interface';
import { Adapter } from './adapter.interface';

export abstract class XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public abstract name: string;

  constructor(
    private readonly pageUrl: string,
    private readonly xpath: string,
    private readonly unavailableText: string,
    protected readonly browser: Browser,
  ) {
    this.pagePromise = this.browser.newPage();
  }

  public async checkAvailability(): Promise<AdapterResult> {
    const page = await this.pagePromise;
    if (page.url() !== this.pageUrl) {
      await page.goto(this.pageUrl);
    } else {
      await page.reload();
    }

    const element = await page.$(this.xpath);
    const text = ((await page.evaluate(({ textContent }) => textContent, element)) as string).trim();

    return {
      name: this.name,
      available: text !== this.unavailableText,
      date: new Date(),
      message: text
    };
  }
}
