import { Pool } from 'pg';


class Listener {
  constructor({ settings, logger }) {
    this.postgres = new Pool(settings.postgres);
    this.logger = logger;
  }

  saveRecord(sensor, value) {
    const values = [
      new Date(),
      sensor,
      value,
    ];
    this.logger.debug('Saving record in database', values);

    this.postgres.query('INSERT INTO ts(time, sensor, value) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
      if (err) {
        this.logger.error(err.message, { err });
        return;
      }
      this.logger.debug('Record saved', { res });
    });
  }

  handle(topic, message) {
    this.logger.debug(`Server-Received: ${topic}`, { message: message.toString() });
    const data = JSON.parse(message.toString());
    this.saveRecord(topic, data.value);
  }
}

export default Listener;
