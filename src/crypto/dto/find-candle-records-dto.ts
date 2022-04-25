import { GetLiveTokenDataDTO } from './get-live-token-data.dto';

export class FindCandleRecordsDTO extends GetLiveTokenDataDTO {
	numRecords: number;

	public constructor(init?: Partial<FindCandleRecordsDTO>) {
		super();
		Object.assign(this, init);
	}
}

export class FindCandleRecordsParam extends FindCandleRecordsDTO {
	candleTimePeriodAsNum: number;
}
