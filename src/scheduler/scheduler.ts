import { TokenCandleModel } from '@prisma/client';
import got from 'got';
import { inject, injectable } from 'inversify';
import { CONSTANTS } from '../common/constants';
import { CandleDataDto } from '../crypto/dto/candle-data-dto';
import { GetLiveTokenDataDTO } from '../crypto/dto/get-live-token-data.dto';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class Scheduler {
	constructor(@inject(TYPES.ILogger) private _logger: ILogger) {}

	async _getDataFromApi(tokenCodes: string[]): Promise<void> {
		try {
			this._logger.log('Getting fresh token data for the following tokens: ', tokenCodes);
			for (const token of tokenCodes) {
				const tokenReqData: GetLiveTokenDataDTO = { token_code: token, candle_time_period: '1m' };
				const candleData: CandleDataDto = await got
					.post(CONSTANTS.GET_LIVE_TOKEN_DATA_ENDPOINT, { json: tokenReqData })
					.json();

				const saveResult: TokenCandleModel = await got
					.post(CONSTANTS.SAVE_LAST_CANDLE_DATA_TO_DB_ENDPOINT, {
						json: candleData,
					})
					.json();
				this._logger.log(saveResult);
			}
		} catch (e) {
			this._logger.error(e);
		}
	}

	async _periodicTokenCandleCaller(): Promise<void> {
		const tokenCodes = [CONSTANTS.TOKEN_CODE_BTC_USD, CONSTANTS.TOKEN_CODE_ETH_USD];
		this._getDataFromApi(tokenCodes);
		const apiDataRefreshPeriod = 60000; // 60 seconds
		setInterval(this._getDataFromApi.bind(this, tokenCodes), apiDataRefreshPeriod);
	}

	async launchApiCaller(): Promise<void> {
		this._logger.log('API caller online! Launching a periodic token data endpoint call routine');
		this._periodicTokenCandleCaller();
	}
}
