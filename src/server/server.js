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
  mqttClient.subscribe('sensor/#');
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
    logger.info(`Publish current temperature: ${res.temperature}`);
    mqttClient.publish('sensor/weather/temperature', JSON.stringify({ value: res.temperature }));

  })
}, settings.weather.interval);
