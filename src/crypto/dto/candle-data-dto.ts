import { GetLiveTokenDataDTO } from './get-live-token-data.dto';

export class CandleDataDto extends GetLiveTokenDataDTO {
	candleData: Array<Array<number>>;
}
