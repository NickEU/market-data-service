import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserService) private _userService: IUserService,
	) {
		super(logger);
		this.bindRoutes([
			{ path: '/login', func: this.login, method: 'post' },
			{
				path: '/register',
				func: this.register,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		_next: NextFunction,
	): Promise<void> {
		// routing and interaction with incoming and outgoing data
		const result = await this._userService.createUser(body);
		if (!result) {
			return _next(new HTTPError(422, 'A user with this email already exists'));
		}
		this.ok(res, { email: result.email, name: result.name });
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(body);
		next(new HTTPError(401, 'Authorization error!', 'login'));
	}
}
