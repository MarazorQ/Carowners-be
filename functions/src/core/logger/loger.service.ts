import log4js from 'log4js';

class Logger {
  private _logger;

  constructor() {
    this._logger = log4js.getLogger();
    this._logger.level = 'info' || 'error';
  }

  public info(message: string) {
    this._logger.info(message);
  }
  public error(message: string) {
    this._logger.error(message);
  }
}

export default new Logger();
