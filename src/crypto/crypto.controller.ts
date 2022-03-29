import { BaseController } from '../common/base.controller';
import { ICryptoController } from './crypto.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ITokenMarketDataService } from './token.market.data.service.interface';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error.class';
import { CandleDataDto } from './dto/candle-data-dto';
import { CRYPTO } from './constants/crypto';
import { PATHS } from './constants/paths';

@injectable()
export class CryptoController extends BaseController implements ICryptoController {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.ITokenMarketDataService) private _tokenMarketDataService: ITokenMarketDataService,
	) {
		super(_logger);
		this.bindRoutes([
			{
				path: PATHS.GET_LIVE_TOKEN_DATA,
				func: this.getLiveTokenData,
				method: 'post',
				middlewares: [new ValidateMiddleware(GetLiveTokenDataDTO)],
			},
			{
				path: PATHS.SAVE_LAST_CANDLE_DATA_TO_DB,
				func: this.saveLastCandleDataToDb,
				method: 'post',
				middlewares: [new ValidateMiddleware(CandleDataDto)],
			},
			{
				path: PATHS.TEST_LIVE_MARKET_DATA_API,
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
			this._logger.logIfDebug('Entering getLiveTokenData controller method');
			const candleData = await this._tokenMarketDataService.getLiveMarketDataForToken(body);
			if (candleData) {
				this._logger.log(`Successfully retrieved candle data for ${body.token_code}`);
				this.ok(res, candleData);
			} else {
				return next(
					new HTTPError(499, 'Error retrieving live token data', CRYPTO.CRYPTO_CONTROLLER),
				);
			}

			next();
		} catch (e) {
			next(e);
		}
	}

	async saveLastCandleDataToDb(
		{ body }: Request<{}, {}, CandleDataDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this._logger.logIfDebug('Entering saveLastCandleDataToDb controller method');
		try {
			if (body.candle_data.length > 0) {
				const candleSaveResult = await this._tokenMarketDataService.createCandleRecordInDb(body);

				if (candleSaveResult) {
					this._logger.log(`Successfully saved a new record for the following candle: `);
					this.ok(res, candleSaveResult);
				} else {
					next(
						new HTTPError(
							498,
							'The record for this candle already exists in the database',
							CRYPTO.CRYPTO_CONTROLLER,
						),
					);
				}
			}
		} catch (e) {
			next(e);
		}
	}
}
