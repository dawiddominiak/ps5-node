import { Database } from 'sqlite';
import * as sqlite3 from 'sqlite3';

import { AdapterResult } from './adapters/adapter-result.interface';
import { logger } from './logger';

const MS_IN_S = 1000;
const S_IN_2_MIN = 2 * 60;

export class Repository {
  constructor(
    private readonly db: Database<sqlite3.Database, sqlite3.Statement>
  ) { }

  public async init() {
    await this.db.exec('BEGIN;');
    await this.db.exec('CREATE TABLE IF NOT EXISTS adapter_results (name TEXT, available INTEGER, message TEXT, date INTEGER);');
    await this.db.exec('CREATE INDEX IF NOT EXISTS adapter_results_names ON adapter_results(name);');
    await this.db.exec('CREATE INDEX IF NOT EXISTS adapter_results_availability ON adapter_results(available);');
    await this.db.exec('CREATE INDEX IF NOT EXISTS adapter_results_dates ON adapter_results(date);');
    await this.db.exec('COMMIT;');
  }

  public async save(adapterResult: AdapterResult) {
    await this.db.run(
      'INSERT INTO adapter_results (name, available, message, date) VALUES (?, ?, ?, ?);',
      adapterResult.name,
      adapterResult.available === true ? 1 : 0,
      adapterResult.message,
      Math.round(adapterResult.date.getTime() / MS_IN_S),
    );
  }

  public async wasAvailableInTheLast2Min(adapterName: string): Promise<boolean> {
    const result = await this.db.get<{ count: number }>('SELECT COUNT(*) as count FROM adapter_results WHERE available = 1 AND date > :date', {
      ':date': Math.round(new Date().getTime() / MS_IN_S) - S_IN_2_MIN,
    });

    logger.info(`${adapterName} was available ${result.count} times in the last 5 minutes.`);

    return result.count > 0;
  }
}
