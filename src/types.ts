export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IConfigService: Symbol.for('IConfigService'),
	IExceptionFilter: Symbol.for('IExceptionFilter'),
	PrismaService: Symbol.for('PrismaService'),
	ICryptoController: Symbol.for('ICryptoController'),
	ITokenMarketDataService: Symbol.for('ITokenMarketDataService'),
	ITokenMarketDataRepository: Symbol.for('ITokenMarketDataRepository'),
	IScheduler: Symbol.for('IScheduler'),
};

export class SslCertificate {
	constructor(
		private readonly _privateKey: string = '',
		private readonly _publicCert: string = '',
	) {}

	get publicCert(): string {
		return this._publicCert;
	}

	get privateKey(): string {
		return this._privateKey;
	}

	wasFound(): boolean {
		return this.privateKey?.length > 0 && this.publicCert?.length > 0;
	}
}
