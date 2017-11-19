import mqtt from 'mqtt';
import settings from 'settings';
import Logger from 'server/logger';
import Listener from 'server/listener';
import Weather from 'server/weather';

const logger = new Logger();

logger.info('Starting server...');

const mqttClient = mqtt.connect(`mqtt://${settings.mosca.host}`);
const listener = new Listener({ settings, logger });
const weather = new Weather({ logger, settings });

mqttClient.on('connect', () => {
  logger.info('MQTT Server connected');
  mqttClient.subscribe('probe');
});

mqttClient.on('message', (topic, message) => listener.handle(topic, message));

logger.info('Server is running.');

// Loading current weather and publish
setInterval(() => {
  weather.find((err, res) => {
    if (err) {
      logger.error(err.message, { err });
      return;
    }
    const payload = {
      'local.temperature': res.temperature,
    };
    logger.info(`Publish current temperature: ${res.temperature}`);

    mqttClient.publish('probe', JSON.stringify(payload));

  })
}, settings.weather.interval);
