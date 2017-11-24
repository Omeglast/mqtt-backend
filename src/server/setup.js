import fs from 'fs';

const sql = fs.readFileSync('sql/1-structure.sql').toString();

class Setup {
  constructor({ logger, postgres }) {
    this.logger = logger;
    this.postgres = postgres;
  }

  setupPostgres() {
    this.logger.info(`Setup Postgres: ${sql}`);
    this.postgres.query(sql);
  }
}

export default Setup;
