/**
 * Settings
 */
module.exports = {
  'mosca': {
    host: 'mqtt_server',
    port: 1883
  },
  'postgres': {
    user: 'admin',
    host: 'storage',
    database: 'iotapi',
    password: 'admin',
    port: 5432,
  },
  'weather': {
    location: 'Paris, FR',
    interval: 5000
  }
};
