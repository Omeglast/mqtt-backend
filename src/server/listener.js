import { InfluxDB, FieldType, escape } from 'influx';

const influx = new InfluxDB({
  host: 'mqtt-influxdb',
  database: 'omeglast',
  schema: [
    {
      measurement: 'sensors',
      fields: {
        value: FieldType.INTEGER,
      },
      tags: [
        'sensor',
      ],
    },
  ],
});

class Listener {
  constructor({ postgres, logger }) {
    this.postgres = postgres;
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

    influx.writePoints([
      {
        measurement: 'sensors',
        tags: { sensor },
        fields: { value },
      },
    ]).then(() => influx.query(`
        select * from response_times
        where sensor = ${escape.stringLit(sensor)}
        order by time desc
        limit 10
      `)).then((rows) => {
      rows.forEach(row => this.logger.info(`A request to ${row.path} took ${row.duration}ms`));
    }).catch(err => this.logger.error(err.message, { err }));
  }

  handle(topic, message) {
    this.logger.debug(`Server-Received: ${topic}`, { message: message.toString() });
    const data = JSON.parse(message.toString());
    if (data.value === undefined) {
      this.saveRecord(topic, data);
    } else {
      this.saveRecord(topic, data.value);
    }
  }
}

export default Listener;
