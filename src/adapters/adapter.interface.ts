import { AdapterResult } from './adapter-result.interface';

export interface Adapter {
  name: string;
  checkAvailability(): Promise<AdapterResult>
}
