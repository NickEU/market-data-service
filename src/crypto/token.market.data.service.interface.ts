export interface ITokenMarketDataService {
	ping: () => Promise<object>;
	getLiveMarketDataForToken: (tokenName: string) => Promise<object>;
}
