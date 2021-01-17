import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const AMAZON_PAGE = 'https://www.amazon.de/-/pl/dp/B08H93ZRK9/ref=sr_1_2?__mk_pl_PL=ÅMÅŽÕÑ&crid=JCYSZ5WBWC6T&dchild=1&keywords=playstation+5&qid=1610248227&sprefix=pla%2Caps%2C189&sr=8-2';
const SHORT_LINK = 'https://amzn.to/3btXajk';
const XPATH = '#availability_feature_div > div > span';
const UNAVAILABLE_TEXT = 'Przedmiot jest obecnie niedostępny.';

export class AmazonAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'Amazon';
  }

  constructor(
    browser: Browser,
  ) {
    super(AMAZON_PAGE, SHORT_LINK, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
