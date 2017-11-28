import { Pool } from 'pg';
import fs from 'fs';
import settings from 'settings';
import Logger from 'server/logger';

const logger = new Logger();
const postgres = new Pool(settings.postgres);

const CURRENT_VERSION = 1;

/**
 * Get current database version
 */
const getDbVersion = () =>
  postgres.query('SELECT to_regclass(\'version\') AS tableExists')
    .then((res) => {
      if (res.rows.length === 0 || res.rows[0].tableExists === null) {
        return 0;
      }
      return postgres.query('SELECT version FROM version')
        .then(res2 => ((res2.rows.length === 0) ? 0 : res2.rows[0].version))
        .catch(err => logger.error(err.message, err));
    })
    .catch(err => logger.error(err.message, err));

/**
 * Update version number
 * @param version
 */
const setVersion = version => postgres.query('UPDATE version SET version = $1', [version])
  .then(res => logger.debug('Version updated', res))
  .catch(err => logger.error(err.message, err));

/**
 * Setup from scratch
 */
const setupPostgres = () => {
  const sql = fs.readFileSync('sql/1-structure.sql').toString();
  logger.info(`Setup Postgres: ${sql}`);
  postgres.query(sql).catch(err => logger.error(err.message, err));
};

/**
 * Launch setup script according to current version
 */
getDbVersion().then((version) => {
  logger.debug(`Version: ${version}`);
  //if (version === 0) {
    setupPostgres();
  //}
  setVersion(CURRENT_VERSION);
});
