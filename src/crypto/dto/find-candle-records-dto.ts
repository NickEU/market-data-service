import { IsString } from "class-validator";

export class FindCandleRecordsDTO {
    @IsString({ message: 'Please provide a valid tokenCode! For example `btcusd`' })
    tokenCode: string;
    @IsString({ message: 'Please provide a valid candleTimePeriod! For example `1`' })
    // TODO: fix inconsistencies with candle-data-dto
    candleTimePeriod: number;
    numRecords: number;

    public constructor(init?:Partial<FindCandleRecordsDTO>) {
        Object.assign(this, init);
    }
}