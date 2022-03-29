import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { inject, injectable } from 'inversify';
import { CONSTANTS } from '../common/constants';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;
	private _env: string;

	constructor(@inject(TYPES.IConfigService) private _configService: IConfigService) {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
		this._env = this._configService.get(CONSTANTS.ENV);
	}

	logIfDebug(...args: unknown[]): void {
		if (this._env === CONSTANTS.DEBUG) this.log(...args);
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		// send to sentry/rollbar
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
