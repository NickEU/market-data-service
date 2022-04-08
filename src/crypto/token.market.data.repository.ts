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
import { FindCandleRecordsParam } from './dto/find-candle-records-dto';

@injectable()
export class TokenMarketDataRepository implements ITokenMarketDataRepository {
	constructor(
		@inject(TYPES.ILogger) private _logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	async getMarketCandleData(dto: GetLiveTokenDataDTO): Promise<CandleDataDto | null> {
		this._logger.logIfDebug('Entering getMarketCandleData repo method');
		const potentialCandleData: any = await got
			.get(`https://api.gemini.com/v2/candles/${dto.tokenCode}/${dto.candleTimePeriod}`)
			.json();
		if (potentialCandleData instanceof Array) {
			const candleData = new CandleDataDto();
			candleData.candleTimePeriod = dto.candleTimePeriod;
			candleData.tokenCode = dto.tokenCode;
			candleData.candleData = potentialCandleData;
			this._logger.logIfDebug('Successfully got the data from gemini api for', dto.tokenCode);
			return candleData;
		}

		return potentialCandleData;
	}

	async createCandleRecordInDb({
		tokenCode,
		time,
		open,
		high,
		low,
		close,
		volume,
		statType,
	}: TokenCandle): Promise<TokenCandleModel | null> {
		this._logger.logIfDebug('Entering createCandleRecordInDb repo method');
		//TODO: make sure duplicate records don't get inserted into the DB for the combination of the same tokenCode, timestamp and statType
		//TODO: token_code should rly be an enum and should be stored in the DB as integer
		const creationResult = this.prismaService.client.tokenCandleModel.create({
			data: { token_code: tokenCode, time, open, high, low, close, volume, stat_type: statType },
		});
		return creationResult;
	}

	async findCandleRecordsInDb({ tokenCode, candleTimePeriodAsNum, numRecords } : FindCandleRecordsParam): Promise<TokenCandleModel[] | null> {
		this._logger.logIfDebug('Entering findCandleRecordsInDb repo method');
		return this.prismaService.client.tokenCandleModel.findMany({
			take: numRecords,
			where: {
				token_code: tokenCode,
				stat_type: candleTimePeriodAsNum,
			},
			orderBy: {
				time: 'desc',
			},
		});
	}
}
