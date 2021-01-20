import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const MEDIAMARKT_PAGE = 'https://mediamarkt.pl/konsole-i-gry/playstation-5/konsole-ps5';
const SHORT_LINK = 'https://bit.ly/3p2YsFJ';
const XPATH = 'h1 > span';
const UNAVAILABLE_TEXT = '(0)';

export class MediaMarktAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'MediaMarkt';
  }

  constructor(
    browser: Browser,
  ) {
    super(MEDIAMARKT_PAGE, SHORT_LINK, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
