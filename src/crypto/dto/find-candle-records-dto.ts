import { IsString } from "class-validator";
import { GetLiveTokenDataDTO } from "./get-live-token-data.dto";

export class FindCandleRecordsDTO extends GetLiveTokenDataDTO {
    @IsString({ message: 'Please provide a valid tokenCode! For example `btcusd`' })
    tokenCode: string;

    numRecords: number;

    public constructor(init?:Partial<FindCandleRecordsDTO>) {
        super()
        Object.assign(this, init);
    }
}

export class FindCandleRecordsParam extends FindCandleRecordsDTO {
    candleTimePeriodAsNum: number;    
}