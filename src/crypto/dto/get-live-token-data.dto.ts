import { IsString } from 'class-validator';

export class GetLiveTokenDataDTO {
	@IsString({ message: 'Please provide a valid token_code! For example `btcusd`' })
	token_code: string;

	@IsString({ message: 'Please provide a valid candle_time_period! For example `1m`' })
	candle_time_period: string;
}
