import { GetLiveTokenDataDTO } from './get-live-token-data.dto';

export class CandleDataDto extends GetLiveTokenDataDTO {
	candle_data: Array<Array<number>>;
}
