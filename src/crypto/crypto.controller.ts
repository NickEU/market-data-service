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
import { ERRORS } from './constants/errors';
import { FindCandleRecordsDTO } from './dto/find-candle-records-dto';

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
			{
				path: PATHS.FIND_LAST_CANDLE_RECORDS_FOR_TOKEN,
				func: this.findLastCandleRecordsForToken,
				method: 'post',
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
				this._logger.log(`Successfully retrieved candle data for ${body.tokenCode}`);
				this.ok(res, candleData);
			} else {
				return next(
					new HTTPError(
						ERRORS.FAILURE_GETTING_LIVE_TOKEN_DATA.CODE,
						ERRORS.FAILURE_GETTING_LIVE_TOKEN_DATA.MSG,
						CRYPTO.CRYPTO_CONTROLLER,
					),
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
			if (body.candleData.length > 0) {
				const candleSaveResult = await this._tokenMarketDataService.createCandleRecordInDb(body);

				if (candleSaveResult) {
					this._logger.log(`Successfully saved a new record for the following candle: `);
					this.ok(res, candleSaveResult);
				} else {
					next(
						new HTTPError(
							ERRORS.RECORD_ALREADY_EXISTS_IN_DB.CODE,
							ERRORS.RECORD_ALREADY_EXISTS_IN_DB.MSG,
							CRYPTO.CRYPTO_CONTROLLER,
						),
					);
				}
			}
		} catch (e) {
			next(e);
		}
	}

	async findLastCandleRecordsForToken( 
		{ body }: Request<{}, {}, FindCandleRecordsDTO>,
		res: Response,
		next: NextFunction
	): Promise<void>  {
		const findCandleDto = new FindCandleRecordsDTO({tokenCode: body.tokenCode, candleTimePeriod: body.candleTimePeriod, numRecords: body.numRecords});

		const result = await this._tokenMarketDataService.findLastCandleRecordsForToken(findCandleDto);

		this._logger.log(`Successfully retreived data for last ${result.length} records.`);
		this.ok(res, result);
	}
}
