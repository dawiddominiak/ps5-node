import { Browser, Page } from 'puppeteer';

import { Adapter } from './adapter.interface';
import { XPathAdapter } from './xpath.adapter';

const MEDIA_EXPERT_PAGE = 'https://www.mediaexpert.pl/gaming/playstation-5/konsole-ps5/konsola-sony-ps5';
const SHORT_LINK = 'https://bit.ly/2Xvy3o4';
const XPATH = '.c-availabilityNotification_text > .a-typo > .is-starred';
const UNAVAILABLE_TEXT = 'niedostępny';

export class MediaExpertAdapter extends XPathAdapter implements Adapter {
  protected pagePromise: Promise<Page>;
  public get name() : string {
    return 'Media Expert';
  }

  constructor(
    browser: Browser,
  ) {
    super(MEDIA_EXPERT_PAGE, XPATH, UNAVAILABLE_TEXT, browser);
  }
}
