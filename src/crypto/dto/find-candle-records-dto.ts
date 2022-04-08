import { IsString } from "class-validator";

export class FindCandleRecordsDTO {
    @IsString({ message: 'Please provide a valid token_code! For example `btcusd`' })
    token_code: string;
    @IsString({ message: 'Please provide a valid candle_time_period! For example `1`' })
    // TODO: fix inconsistencies with candle-data-dto
    candle_time_period: number;
    num_records: number;

    public constructor(init?:Partial<FindCandleRecordsDTO>) {
        Object.assign(this, init);
    }
}