import mqtt from 'mqtt';
import { Pool } from 'pg';
import settings from 'settings';
import Logger from 'server/logger';
import Listener from 'server/listener';
import Setup from 'server/setup';

const logger = new Logger();

logger.info('Starting server...');

const mqttClient = mqtt.connect(`mqtt://${settings.mqtt.host}`);
const postgres = new Pool(settings.postgres);
const listener = new Listener({ logger, postgres });
const setup = new Setup({ logger, postgres });

setup.setupPostgres();

mqttClient.on('connect', () => {
  logger.info('MQTT Server connected');
  mqttClient.subscribe('sensor/#');
});

mqttClient.on('message', (topic, message) => listener.handle(topic, message));

logger.info('Server is running.');
