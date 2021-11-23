import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		console.dir(this);
		this.bindRoutes([
			{ path: '/login', func: this.login, method: 'post' },
			{ path: '/register', func: this.register, method: 'post' },
		]);
	}

	register(_req: Request, res: Response, _next: NextFunction): void {
		this.ok(res, 'Registration successful');
	}

	login(_req: Request, _res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Authorization error!', 'login'));
	}
}
