import { CRYPTO } from '../constants/crypto';
import { TokenCandleTimePeriod } from '../types';

export const HELPERS = {
	convertCandleTimePeriodStringToEnum(candlePeriod: string): TokenCandleTimePeriod {
		switch (candlePeriod) {
			case CRYPTO.CANDLE_TIME_PERIOD_ONE_MINUTE:
				return TokenCandleTimePeriod.ONE_MINUTE;
			default:
				return TokenCandleTimePeriod.ONE_HOUR;
		}
	},
};
