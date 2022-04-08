import { IsString } from 'class-validator';

export class GetLiveTokenDataDTO {
	@IsString({ message: 'Please provide a valid tokenCode! For example `btcusd`' })
	tokenCode: string;

	@IsString({ message: 'Please provide a valid candleTimePeriod! For example `1m`' })
	candleTimePeriod: string;
}
