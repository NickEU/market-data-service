import 'reflect-metadata';
import express, { Express } from 'express';
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
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running at https://localhost:${this.port}!`);
		await this.scheduler.launchApiCaller();
	}

	public close(): void {
		this.server.close();
	}
}
