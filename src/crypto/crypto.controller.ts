import { BaseController } from '../common/base.controller';
import { ICryptoController } from './crypto.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import CoinGecko from 'coingecko-api';

@injectable()
export class CryptoController extends BaseController implements ICryptoController {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.IConfigService) private _configService: IConfigService,
	) {
		super(_logger);
		this.bindRoutes([
			{
				path: '/getLiveTokenDataFromExternalApi',
				func: this.getLiveTokenDataFromExternalApi,
				method: 'get',
			},
		]);
	}

	async getLiveTokenDataFromExternalApi(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const CoinGeckoClient = new CoinGecko();
		const func = async (): Promise<void> => {
			const data = await CoinGeckoClient.ping();
			this._logger.log(data);
			this.ok(res, data);
		};
		func();
	}
}
