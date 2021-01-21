import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const NEONET_PAGE = 'https://www.neonet.pl/konsole-i-gry/playstation-5-cyberpunk-2077-playstation-4-the-last-of-us-part-ii-playstation-4-ghost-of-tsushima-playstation-4-kontroler-dualsense.html?tduid=08a07605b7c099610f6252b528ccecb6&affId=2208151&utm_source=tradedoubler&utm_medium=afiliacja';
const SHORT_LINK = 'https://bit.ly/3p5cV48';
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
    super(NEONET_PAGE, SHORT_LINK, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
