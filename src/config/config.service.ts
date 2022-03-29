import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor() {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			console.log('[ConfigService] Unable to read .env file.');
		} else {
			console.log('[ConfigService] Loaded configuration from .env file.');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
