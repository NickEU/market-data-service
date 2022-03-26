import { TokenCandle } from './candle.entity';
import { TokenCandleModel } from '@prisma/client';

export interface ITokenMarketDataRepository {
	create: (user: TokenCandle) => Promise<TokenCandleModel | null>;
	find: (tokenCode: string, statType: number) => Promise<TokenCandleModel[] | null>;
}
