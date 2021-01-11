import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const EURO_PAGE = 'https://m.euro.com.pl/konsole-playstation-5.bhtml';
const SHORT_LINK = 'https://bit.ly/3i3pzh7';
const XPATH = '.availability-notification h3';
const UNAVAILABLE_TEXT = 'Produkt tymczasowo niedostępny';

export class EuroAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'Euro RTV AGD';
  }

  constructor(
    browser: Browser,
  ) {
    super(EURO_PAGE, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
