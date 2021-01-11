import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const EMPIK_PAGE = 'https://www.empik.com/konsola-sony-playstation-5-1-tb-sony,p1244094954,multimedia-p';
const SHORT_LINK = 'https://bit.ly/3i2PvK7';
const XPATH = '.sellerNav__title';
const UNAVAILABLE_TEXT = 'Produkt niedostępny';

export class EmpikAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'Empik';
  }

  constructor(
    browser: Browser,
  ) {
    super(EMPIK_PAGE, XPATH, SHORT_LINK, UNAVAILABLE_TEXT, browser);
  }
}
