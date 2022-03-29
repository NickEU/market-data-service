import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ITokenMarketDataService } from './token.market.data.service.interface';
import CoinGecko from 'coingecko-api';
import { ITokenMarketDataRepository } from './token.market.data.repository.interface';
import { TokenCandle } from './candle.entity';
import { TokenCandleModel } from '@prisma/client';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { CandleDataDto } from './dto/candle-data-dto';
import { CRYPTO } from './constants/crypto';
@injectable()
export class TokenMarketDataService implements ITokenMarketDataService {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.IConfigService) private _configService: IConfigService,
		@inject(TYPES.ITokenMarketDataRepository)
		private _tokenMarketDataRepo: ITokenMarketDataRepository,
	) {}

	_getGeckoApiPingResult = async (): Promise<object> => {
		const CoinGeckoClient = new CoinGecko();
		const data = await CoinGeckoClient.ping();
		this._logger.log(data);
		return data;
	};

	async ping(): Promise<object> {
		const pingResult = await this._getGeckoApiPingResult();
		return pingResult;
	}

	async getLiveMarketDataForToken(dto: GetLiveTokenDataDTO): Promise<CandleDataDto | null> {
		this._logger.logIfDebug('Entering getLiveMarketDataForToken service method');
		const result = await this._tokenMarketDataRepo.getMarketCandleData(dto);
		return result;
	}

	async createCandleRecordInDb({
		token_code,
		candle_data,
		candle_time_period,
	}: CandleDataDto): Promise<TokenCandleModel | null> {
		this._logger.logIfDebug('Entering createCandleRecordInDb service method');

		const freshCandleStats = candle_data[0];
		// TODO: make proper stat type conversion helpers
		const statType = candle_time_period === CRYPTO.CANDLE_TIME_PERIOD_ONE_MINUTE ? 1 : 2;

		const [timeMs, openPrice, highPrice, lowPrice, closePrice, volume] = freshCandleStats;
		this._logger.logIfDebug(
			`Time = ${timeMs}, Open price = ${openPrice}, Close Price = ${highPrice}, Low price = ${lowPrice}, Close Price = ${closePrice}, Volume = ${volume}`,
		);
		const candle = new TokenCandle(
			token_code,
			new Date(timeMs),
			openPrice,
			highPrice,
			lowPrice,
			closePrice,
			volume,
			statType,
		);
		const result = await this._tokenMarketDataRepo.createCandleRecordInDb(candle);
		return result;
	}

	async findLastCandleRecordInDb(
		tokenCode: string,
		statType: number,
	): Promise<TokenCandleModel | null> {
		this._logger.logIfDebug('Entering findLastCandleRecordInDb service method');
		const result = await this._tokenMarketDataRepo.findCandleRecordsInDb(tokenCode, statType);
		if (result) {
			this._logger.log(`Last record found:`);
			this._logger.log(result[0]);
			return result[0];
		}
		return null;
	}
}
