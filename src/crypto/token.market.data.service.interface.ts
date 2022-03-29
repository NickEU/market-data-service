import { TokenCandleModel } from '@prisma/client';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { CandleDataDto } from './dto/candle-data-dto';

export interface ITokenMarketDataService {
	ping: () => Promise<object>;

	getLiveMarketDataForToken: (body: GetLiveTokenDataDTO) => Promise<CandleDataDto | null>;

	createCandleRecordInDb: (body: CandleDataDto) => Promise<TokenCandleModel | null>;

	findLastCandleRecordInDb: (
		tokenCode: string,
		statType: number,
	) => Promise<TokenCandleModel | null>;
}
