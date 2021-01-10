import { AdapterResult } from 'src/adapters/adapter-result.interface';

export interface Channel {
  name: string;
  communicate(results: AdapterResult[]): Promise<void>;
}
