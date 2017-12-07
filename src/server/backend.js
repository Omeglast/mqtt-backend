class Backend {
  constructor({ postgres, logger }) {
    this.postgres = postgres;
    this.logger = logger;
  }

  saveTs(sensor, value, time) {
    this.postgres.query(
      'INSERT INTO ts(time, sensor, value) VALUES($1, $2, $3) RETURNING *',
      [ time, sensor, value ],
      (err, res) => {
        if (err) {
          this.logger.error(err.message, { err });
          return;
        }
        this.logger.debug('Record saved', { res });
      });
  }

  insertOrUpdatePeriod(sensor, value, time, unit) {
    this.postgres.query("SELECT value FROM ts_periods WHERE sensor = $1 ORDER BY start_tz DESC LIMIT 1", [ sensor ])
      .then(found => )
  }

  saveValue(sensor, value, time = new Date(), unit = null) {
    this.saveTs(sensor, value, time);
    this.insertOrUpdatePeriod(sensor, value, time, unit);
  }
}

export default Backend;
