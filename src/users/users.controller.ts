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
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { CONSTANTS } from '../common/constants';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserService) private _userService: IUserService,
		@inject(TYPES.IConfigService) private _configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/login',
				func: this.login,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				func: this.register,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				func: this.info,
				method: 'get',
				middlewares: [new AuthGuard()],
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
			return _next(new HTTPError(422, 'A user with this email already exists', 'UsersController'));
		}
		this.ok(res, { email: result.email, name: result.name });
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const loginSuccessful = await this._userService.validateUser(body);
		if (loginSuccessful) {
			const secret = this._configService.get(CONSTANTS.SECRET);
			const jwt = await this.signJWT(body.email, secret);
			this.ok(res, { jwt });
		} else {
			next(new HTTPError(401, 'Invalid username or password!', 'Login'));
		}
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this._userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
