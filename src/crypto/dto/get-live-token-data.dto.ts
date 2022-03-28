import { IsString } from 'class-validator';

export class GetLiveTokenDataDTO {
	@IsString({ message: 'Please provide a valid token_code! For example `btcusd`' })
	token_code: string;

	candle_time_period: string;
}
