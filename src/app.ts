import 'reflect-metadata';
import express, { Express } from 'express';
import https from 'https';
import cors from 'cors';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ICryptoController } from './crypto/crypto.controller.interface';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { CONSTANTS } from './common/constants';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { IScheduler } from './scheduler/scheduler.interface';
import { tryGetSslCertificate } from './ssl';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ICryptoController) private cryptoController: ICryptoController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.IScheduler) private scheduler: IScheduler,
	) {
		this.app = express();
		const port = this.configService.get(CONSTANTS.PORT) ?? 8000;
		this.port = Number(port);
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cors());
		const authMiddleware = new AuthMiddleware(this.configService.get(CONSTANTS.SECRET));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/crypto', this.cryptoController.router);
	}

	useExceptionFilters(): void {
		//bind to avoid losing context in express
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();

		this.createServer();

		this.logger.log(`Server is running at http://localhost:${this.port}!`);
		await this.scheduler.launchApiCaller();
	}

	createServer(): void {
		const sslLocationPrivateKey = this.configService.get(CONSTANTS.PRIVATE_KEY);
		const sslLocationPublicCert = this.configService.get(CONSTANTS.PUBLIC_CERT);
		const encoding: BufferEncoding = 'utf8';
		const sslCert = tryGetSslCertificate(sslLocationPrivateKey, sslLocationPublicCert, encoding);

		if (sslCert.wasFound()) {
			const options = {
				key: sslCert.privateKey,
				cert: sslCert.publicCert,
			};
			this.server = https.createServer(options, this.app).listen(this.port);
			this.logger.log(
				`Successfully loaded the SSL certificate from ${sslLocationPublicCert}. Running in HTTPS mode.`,
			);
		} else {
			this.logger.log(`No SSL certificate found, running in HTTP mode`);
			this.server = this.app.listen(this.port);
		}
	}

	public close(): void {
		this.server.close();
	}
}
