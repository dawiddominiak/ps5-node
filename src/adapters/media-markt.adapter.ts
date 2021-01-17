import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const MEDIAMARKT_PAGE = 'https://mediamarkt.pl/konsole-i-gry/konsola-sony-playstation-5';
const SHORT_LINK = 'https://bit.ly/3668crB';
const XPATH = '.b-ofrBox_cta > div > form > div > p > span';
const UNAVAILABLE_TEXT = 'niedostępny';

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
