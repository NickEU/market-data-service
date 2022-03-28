import { BaseController } from '../common/base.controller';
import { ICryptoController } from './crypto.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { ITokenMarketDataService } from './token.market.data.service.interface';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { CONSTANTS } from '../common/constants';
import { HTTPError } from '../errors/http-error.class';

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
				method: 'post',
				middlewares: [new ValidateMiddleware(GetLiveTokenDataDTO)],
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

	async getLiveTokenData(
		{ body }: Request<{}, {}, GetLiveTokenDataDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = body.token_code;
			const timePeriod = body.candle_time_period ?? CONSTANTS.CANDLE_TIME_PERIOD_ONE_MINUTE;

			const candleData = await this._tokenMarketDataService.getLiveMarketDataForToken(
				id,
				timePeriod,
			);

			if (candleData.length > 0) {
				const freshCandleStats = candleData[0];
				// TODO: make proper stat type conversion helpers
				const statType = timePeriod === CONSTANTS.CANDLE_TIME_PERIOD_ONE_MINUTE ? 1 : 2;

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
					return next(
						new HTTPError(
							422,
							'The record for this candle already exists in the database',
							'CryptoController',
						),
					);
				}
			}
			next();
		} catch (e) {
			next(e);
		}
	}
}
