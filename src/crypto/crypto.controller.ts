import { BaseController } from '../common/base.controller';
import { ICryptoController } from './crypto.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { ITokenMarketDataService } from './token.market.data.service.interface';

@injectable()
export class CryptoController extends BaseController implements ICryptoController {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.IConfigService) private _configService: IConfigService,
		@inject(TYPES.ITokenMarketDataService) private _tokenMarketDataService: ITokenMarketDataService,
	) {
		super(_logger);
		this.bindRoutes([
			{
				path: '/getLiveTokenData',
				func: this.getLiveTokenData,
				method: 'get',
			},
			{
				path: '/testLiveMarketDataApi',
				func: this.testLiveMarketDataApi,
				method: 'get',
			},
		]);
	}

	async testLiveMarketDataApi(req: Request, res: Response, next: NextFunction): Promise<void> {
		const pingResult = await this._tokenMarketDataService.ping();
		this.ok(res, pingResult);
	}

	async getLiveTokenData(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'Hello');
	}
}
