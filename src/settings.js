/**
 * Settings
 */
module.exports = {
  mqtt: {
    host: process.env.MQTT_HOST || 'mqtt_server',
    port: process.env.MQTT_POST || 1883
  },
  postgres: {
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.POSTGRES_HOST || 'storage',
    database: process.env.POSTGRES_DATABASE || 'omeglast',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    port: process.env.POSTGRES_PORT || 5432
  }
};
