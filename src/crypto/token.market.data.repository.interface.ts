import { TokenCandle } from './candle.entity';
import { TokenCandleModel } from '@prisma/client';
import { CandleDataDto } from './dto/candle-data-dto';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { FindCandleRecordsParam } from './dto/find-candle-records-dto';

export interface ITokenMarketDataRepository {
	createCandleRecordInDb: (user: TokenCandle) => Promise<TokenCandleModel | null>;
	findCandleRecordsInDb: (dto: FindCandleRecordsParam) => Promise<TokenCandleModel[] | null>;
	getMarketCandleData: (dto: GetLiveTokenDataDTO) => Promise<CandleDataDto | null>;
}
