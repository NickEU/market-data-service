export class TokenCandle {
	constructor(
		private readonly _token_code: string,
		private readonly _time: Date,
		private readonly _open: number,
		private readonly _high: number,
		private readonly _low: number,
		private readonly _close: number,
		private readonly _volume: number,
		private readonly _stat_type: number,
	) {}

	get token_code(): string {
		return this._token_code;
	}

	get time(): Date {
		return this._time;
	}

	get open(): number {
		return this._open;
	}

	get high(): number {
		return this._high;
	}

	get low(): number {
		return this._low;
	}

	get close(): number {
		return this._close;
	}

	get volume(): number {
		return this._volume;
	}

	get stat_type(): number {
		return this._stat_type;
	}
}
