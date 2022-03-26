import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ITokenMarketDataService } from './token.market.data.service.interface';
import CoinGecko from 'coingecko-api';
import got from 'got';
@injectable()
export class TokenMarketDataService implements ITokenMarketDataService {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.IConfigService) private _configService: IConfigService,
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
	): Promise<Array<Array<Number>>> {
		const result: any = await got
			.get(`https://api.gemini.com/v2/candles/${tokenId}/${timePeriod}`)
			.json();
		return result;
	}

	async createCandleRecordInDb(candleData: Number[]): Promise<boolean> {
		this._logger.log(candleData);
		const [timeMs] = candleData;
		return true;
	}
}
