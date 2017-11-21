import { config, Logger as WinstonLogger, transports } from 'winston';

class Logger {
  constructor() {
    this.logger = new (WinstonLogger)({
      level: 'debug',
      transports: [
        new (transports.Console)({
          timestamp: () => (new Date()).toLocaleString(),
          prettyPrint: true,
          formatter: options => `${config.colorize('data', options.timestamp())} ${config.colorize(options.level, options.level.toUpperCase())} ${options.message ? options.message : ''} ${config.colorize('data', JSON.stringify(options.meta))}`,
        }),
      ],
    });
  }

  /**
   * Default log function
   * @param {string} level
   * @param {string} msg
   * @param {object=} meta
   */
  log(level, msg, meta) {
    this.logger.log(level, msg, meta);
  }

  /**
   * Log debug message
   * @param {string} msg
   * @param {object=} meta
   */
  debug(msg, meta) {
    this.log('debug', msg, meta);
  }

  /**
   * Log info message
   * @param {string} msg
   * @param {object=} meta
   */
  info(msg, meta) {
    this.log('info', msg, meta);
  }

  /**
   * Log warning message
   * @param {string} msg
   * @param {object=} meta
   */
  warn(msg, meta) {
    this.log('warning', msg, meta);
  }

  /**
   * Log error message
   * @param {string} msg
   * @param {object=} meta
   */
  error(msg, meta) {
    this.log('error', msg, meta);
  }
}

export default Logger;
