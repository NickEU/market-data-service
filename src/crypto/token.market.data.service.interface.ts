import { TokenCandleModel } from '@prisma/client';

export interface ITokenMarketDataService {
	ping: () => Promise<object>;
	getLiveMarketDataForToken: (
		tokenName: string,
		timePeriod: string,
	) => Promise<Array<Array<number>>>;
	createCandleRecordInDb: (
		tokenCode: string,
		candleData: Array<number>,
		statType: number,
	) => Promise<TokenCandleModel | null>;
	findLastCandleRecordInDb: (
		tokenCode: string,
		statType: number,
	) => Promise<TokenCandleModel | null>;
}
