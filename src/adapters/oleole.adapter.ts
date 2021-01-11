import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const OLEOLE_PAGE = 'https://www.oleole.pl/konsole-playstation-5/sony-konsola-playstation-5-ps5-blu-ray-4k.bhtml';
const SHORT_LINK = 'https://bit.ly/3q3iDDu'
const XPATH = '.availability-notification h3';
const UNAVAILABLE_TEXT = 'Produkt tymczasowo niedostępny';

export class OleOleAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'OleOle';
  }

  constructor(
    browser: Browser,
  ) {
    super(OLEOLE_PAGE, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
