import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const NEONET_PAGE = 'https://www.neonet.pl/konsole-i-gry/sony-playstation-5.html';
const XPATH = '.productShopCss-unpublished-3cK';
const UNAVAILABLE_TEXT = 'PRODUKT NIEDOSTĘPNY';

export class NeonetAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'NeoNet';
  }

  constructor(
    browser: Browser,
  ) {
    super(NEONET_PAGE, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
