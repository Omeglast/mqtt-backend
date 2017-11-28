class Backend {
  constructor({ postgres, logger }) {
    this.postgres = postgres;
    this.logger = logger;
  }

  saveValue(time, sensor, value, unit = null) {

  }
}
