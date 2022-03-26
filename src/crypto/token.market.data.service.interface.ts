export interface ITokenMarketDataService {
	ping: () => Promise<object>;
	getLiveMarketDataForToken: (
		tokenName: string,
		timePeriod: string,
	) => Promise<Array<Array<Number>>>;
	createCandleRecordInDb: (candleData: Array<Number>) => Promise<boolean>;
}
