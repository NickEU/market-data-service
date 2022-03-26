import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ITokenMarketDataService } from './token.market.data.service.interface';
import CoinGecko from 'coingecko-api';
import got from 'got';
import { ITokenMarketDataRepository } from './token.market.data.repository.interface';
import { TokenCandle } from './candle.entity';
import { TokenCandleModel } from '@prisma/client';
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

	async getLiveMarketDataForToken(
		tokenId: string,
		timePeriod: string,
	): Promise<Array<Array<number>>> {
		const result: any = await got
			.get(`https://api.gemini.com/v2/candles/${tokenId}/${timePeriod}`)
			.json();
		// for (const candle of result) {
		// 	const date = new Date(candle[0]).toLocaleTimeString('en-US');
		// 	this._logger.log(date);
		// 	// expected output "8/30/2017"
		// }
		return result;
	}

	async createCandleRecordInDb(
		tokenCode: string,
		candleData: number[],
		statType: number,
	): Promise<TokenCandleModel | null> {
		this._logger.log(candleData);
		const [timeMs, openPrice, highPrice, lowPrice, closePrice, volume] = candleData;
		this._logger.log(
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
		//TODO: make sure duplicate records don't get inserted into the DB for the combination of the same tokenCode, timestamp and statType
		const result = await this._tokenMarketDataRepo.create(candle);
		return result;
	}

	async findLastCandleRecordInDb(
		tokenCode: string,
		statType: number,
	): Promise<TokenCandleModel | null> {
		const result = await this._tokenMarketDataRepo.find(tokenCode, statType);
		this._logger.log(`Following records found:`);
		this._logger.log(result);
		if (result) {
			this._logger.log(`Last record found:`);
			this._logger.log(result[0]);
			return result[0];
		}
		return null;
	}
}
