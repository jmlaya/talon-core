import { SQL } from 'bun';
import { log } from './log';
import { GeneralAppOptions } from './types';

function parseOptions(options: GeneralAppOptions['database']) {
  const { pool, ssl, ...baseOptions } = options ?? {};
  return {
    ...baseOptions,
    ssl: ssl?.toString() === 'true' ? { rejectUnauthorized: false } : false,
    ...{
      max: pool?.max ?? 10,
      maxLifetime: pool?.maxLifetime ?? 30000,
      idleTimeout: pool?.idleTimeout ?? 10000,
      connectionTimeout: pool?.connectionTimeout ?? 5000,
    },
  };
}

export async function initializeDatabase(options?: GeneralAppOptions['database']) {
  const flatOptions = parseOptions(options);

  try {
    const sql = new SQL(flatOptions);

    await sql.connect();

    log.INFO('Database initialized successfully');

    return sql;
  } catch (error) {
    log.ERROR('Failed to connect to the database:', error);
    process.exit(1);
  }
}
