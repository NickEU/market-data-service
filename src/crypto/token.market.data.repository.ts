import { TokenCandleModel } from '.prisma/client';
import { TokenCandle } from './candle.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { ITokenMarketDataRepository } from './token.market.data.repository.interface';

@injectable()
export class TokenMarketDataRepository implements ITokenMarketDataRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({
		token_code,
		time,
		open,
		high,
		low,
		close,
		volume,
		stat_type,
	}: TokenCandle): Promise<TokenCandleModel | null> {
		//TODO: make sure duplicate records don't get inserted into the DB for the combination of the same tokenCode, timestamp and statType
		const creationResult = this.prismaService.client.tokenCandleModel.create({
			data: { token_code, time, open, high, low, close, volume, stat_type },
		});
		return creationResult;
	}

	async find(token_code: string): Promise<TokenCandleModel[] | null> {
		return this.prismaService.client.tokenCandleModel.findMany({
			where: {
				token_code,
			},
			orderBy: {
				time: 'desc',
			},
		});
	}
}
