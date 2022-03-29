import { TokenCandleModel } from '.prisma/client';
import { TokenCandle } from './candle.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { ITokenMarketDataRepository } from './token.market.data.repository.interface';
import { GetLiveTokenDataDTO } from './dto/get-live-token-data.dto';
import { CandleDataDto } from './dto/candle-data-dto';
import got from 'got';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class TokenMarketDataRepository implements ITokenMarketDataRepository {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	async getMarketCandleData(dto: GetLiveTokenDataDTO): Promise<CandleDataDto | null> {
		this._logger.logIfDebug('Entering getMarketCandleData repo method');
		const potentialCandleData: any = await got
			.get(`https://api.gemini.com/v2/candles/${dto.token_code}/${dto.candle_time_period}`)
			.json();
		if (potentialCandleData instanceof Array) {
			const candleData = new CandleDataDto();
			candleData.candle_time_period = dto.candle_time_period;
			candleData.token_code = dto.token_code;
			candleData.candle_data = potentialCandleData;
			this._logger.logIfDebug('Successfully got the data from gemini api for', dto.token_code);
			return candleData;
		}

		return potentialCandleData;
	}

	async createCandleRecordInDb({
		token_code,
		time,
		open,
		high,
		low,
		close,
		volume,
		stat_type,
	}: TokenCandle): Promise<TokenCandleModel | null> {
		this._logger.logIfDebug('Entering createCandleRecordInDb repo method');
		//TODO: make sure duplicate records don't get inserted into the DB for the combination of the same tokenCode, timestamp and statType
		const creationResult = this.prismaService.client.tokenCandleModel.create({
			data: { token_code, time, open, high, low, close, volume, stat_type },
		});
		return creationResult;
	}

	async findCandleRecordsInDb(token_code: string): Promise<TokenCandleModel[] | null> {
		this._logger.logIfDebug('Entering findCandleRecordsInDb repo method');
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
