import mqtt from 'mqtt';
import settings from 'settings';
import Logger from 'server/logger';
import Listener from 'server/listener';

const logger = new Logger();

logger.info('Starting server...');

const mqttClient = mqtt.connect(`mqtt://${settings.mqtt.host}`);
const listener = new Listener({ settings, logger });

mqttClient.on('connect', () => {
  logger.info('MQTT Server connected');
  mqttClient.subscribe('sensor/#');
});

mqttClient.on('message', (topic, message) => listener.handle(topic, message));

logger.info('Server is running.');
