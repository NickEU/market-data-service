export interface ILogger {
	logger: unknown;

	logIfDebug: (...args: unknown[]) => void;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
