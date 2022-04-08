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
import { FindCandleRecordsDTO } from './dto/find-candle-records-dto';
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
		tokenCode,
		candleData,
		candleTimePeriod,
	}: CandleDataDto): Promise<TokenCandleModel | null> {
		this._logger.logIfDebug('Entering createCandleRecordInDb service method');

		const freshCandleStats = candleData[0];
		// TODO: make proper stat type conversion helpers
		// TODO: statType should be an enum
		const statType = candleTimePeriod === CRYPTO.CANDLE_TIME_PERIOD_ONE_MINUTE ? 1 : 2;

		const [timeMs, openPrice, highPrice, lowPrice, closePrice, volume] = freshCandleStats;
		this._logger.logIfDebug(
			`Time = ${timeMs}, Open price = ${openPrice}, Close Price = ${highPrice}, Low price = ${lowPrice}, Close Price = ${closePrice}, Volume = ${volume}`,
		);
		const candle = new TokenCandle(
			tokenCode,
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

	async findLastCandleRecordsForToken(findCandleRecordsDto: FindCandleRecordsDTO): Promise<TokenCandleModel[]> {
		this._logger.logIfDebug('Entering findLastCandleRecordInDb service method');
		findCandleRecordsDto.numRecords = findCandleRecordsDto.numRecords ?? 100;
		findCandleRecordsDto.candleTimePeriod = +findCandleRecordsDto.candleTimePeriod ?? 1;
		const result = await this._tokenMarketDataRepo.findCandleRecordsInDb(findCandleRecordsDto);
		return result ?? [];
	}
}
