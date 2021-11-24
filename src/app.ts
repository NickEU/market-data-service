import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { IUserController } from './users/users.controller.interface';
import { json } from 'body-parser';
@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running at https://localhost:${this.port}`);
	}
}
