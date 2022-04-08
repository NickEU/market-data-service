import { TokenCandleModel } from '@prisma/client';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { CandleDataDto } from './dto/candle-data-dto';
import { FindCandleRecordsDTO } from './dto/find-candle-records-dto';

export interface ITokenMarketDataService {
	ping: () => Promise<object>;

	getLiveMarketDataForToken: (body: GetLiveTokenDataDTO) => Promise<CandleDataDto | null>;

	createCandleRecordInDb: (body: CandleDataDto) => Promise<TokenCandleModel | null>;

	findLastCandleRecordsForToken: (body: FindCandleRecordsDTO) => Promise<TokenCandleModel[]>;
}
