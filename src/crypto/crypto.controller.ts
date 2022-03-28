import { BaseController } from '../common/base.controller';
import { ICryptoController } from './crypto.controller.interface';
import { Request, Response, NextFunction } from 'express';
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
		try {
			const pingResult = await this._tokenMarketDataService.ping();
			this.ok(res, pingResult);
			next();
		} catch (e) {
			next(e);
		}
	}

	async getLiveTokenData({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = body.id;
			const timePeriod = body.timePeriod ?? '1m';
			if (!id) {
				res.sendStatus(404) && next();
				return;
			}
			const pingResult = await this._tokenMarketDataService.getLiveMarketDataForToken(
				id,
				timePeriod,
			);
			if (pingResult.length > 0) {
				const freshCandleStats = pingResult[0];
				// TODO: make proper stat type conversion helpers
				const statType = timePeriod === '1m' ? 1 : 2;
				const candleSaveResult = await this._tokenMarketDataService.createCandleRecordInDb(
					id,
					freshCandleStats,
					statType,
				);
				if (candleSaveResult) {
					const lastSavedCandleInDb = await this._tokenMarketDataService.findLastCandleRecordInDb(
						id,
						statType,
					);
					this.ok(res, candleSaveResult);
				} else {
					res.sendStatus(500);
				}
			}
			next();
		} catch (e) {
			next(e);
		}
	}
}
