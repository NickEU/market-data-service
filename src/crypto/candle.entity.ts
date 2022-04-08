export class TokenCandle {
	constructor(
		private readonly _tokenCode: string,
		private readonly _time: Date,
		private readonly _open: number,
		private readonly _high: number,
		private readonly _low: number,
		private readonly _close: number,
		private readonly _volume: number,
		private readonly _statType: number,
	) {}

	get tokenCode(): string {
		return this._tokenCode;
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

	get statType(): number {
		return this._statType;
	}
}
