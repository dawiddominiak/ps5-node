import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const KOMPUTRONIK_PAGE = 'https://www.komputronik.pl/product/701046/sony-playstation-5.html';
const SHORT_LINK = 'https://bit.ly/2Xve1di';
const XPATH = '.tooltip-wrap.pretty';
const UNAVAILABLE_TEXT = 'Produkt tymczasowo niedostępny.';

export class KomputronikAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'Komputronik';
  }

  constructor(
    browser: Browser,
  ) {
    super(KOMPUTRONIK_PAGE, SHORT_LINK, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
