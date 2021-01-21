import { Browser, Page } from 'puppeteer';

import { AdapterResult } from './adapter-result.interface';
import { Adapter } from './adapter.interface';

const TIMEOUT = 60 * 1000;

export abstract class XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public abstract name: string;

  constructor(
    private readonly pageUrl: string,
    private readonly shortLink: string,
    private readonly xpath: string,
    private readonly unavailableText: string,
    protected readonly browser: Browser,
  ) {
    this.pagePromise = this.browser.newPage();
  }

  public async checkAvailability(): Promise<AdapterResult> {
    const page = await this.pagePromise;
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15')
    if (page.url() !== this.pageUrl) {
      await page.goto(this.pageUrl, {
        timeout: TIMEOUT,
      });
    } else {
      await page.reload({
        timeout: TIMEOUT,
      });
    }

    try {
      await page.waitForSelector(this.xpath, { timeout: TIMEOUT });
    } catch {
      return {
        name: this.name,
        available: true,
        date: new Date(),
        link: this.shortLink,
        message: '[[Missing selector]]'
      };
    }

    const element = await page.$(this.xpath);
    const text = ((await page.evaluate((p) => p?.textContent ?? null, element)) as string | null)?.trim();

    return {
      name: this.name,
      available: text !== this.unavailableText,
      date: new Date(),
      link: this.shortLink,
      message: text
    };
  }
}
