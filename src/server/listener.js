import { Pool } from 'pg';


class Listener {
  constructor({ settings, logger }) {
    this.postgres = new Pool(settings.postgres);
    this.logger = logger;
  }

  saveRecord(key, value) {
    const values = [
      1,
      new Date(),
      key,
      value
    ];
    this.logger.debug('Saving record in database', values);

    this.postgres.query('INSERT INTO ts(source_id, time, topic, value) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
      if (err) {
        return this.logger.error(err.message, { err });
      }
      this.logger.info('Record saved', { res });
    });
  }

  handle(topic, message) {
    this.logger.debug(`Server-Received: ${topic}`, { message: message.toString() });
    const data = JSON.parse(message.toString());

    for (let property in data) {
      if (data.hasOwnProperty(property)) {
        this.saveRecord(property, data[property]);
      }
    }
  }
}

export default Listener;
