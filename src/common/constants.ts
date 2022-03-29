export const CONSTANTS = {
	// old
	SALT: 'SALT',
	PORT: 'PORT',
	SECRET: 'SECRET',

	// internal endpoints
	GET_LIVE_TOKEN_DATA_ENDPOINT: 'http://127.0.0.1:8000/crypto/getLiveTokenData',
	SAVE_LAST_CANDLE_DATA_TO_DB_ENDPOINT: 'http://127.0.0.1:8000/crypto/saveLastCandleDataToDb',

	// endpoint codes
	TOKEN_CODE_BTC_USD: 'btcusd',
	TOKEN_CODE_ETH_USD: 'ethusd',
	CANDLE_TIME_PERIOD_ONE_MINUTE: '1m',

	//environment related
	DEBUG: 'DEBUG',
	LIVE: 'LIVE',
	ENV: 'ENV',
};
