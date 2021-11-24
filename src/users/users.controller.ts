import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
// import fs from 'fs';
// import { resolve } from 'path';

// const data = [];

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		this.bindRoutes([
			{ path: '/login', func: this.login, method: 'post' },
			{ path: '/register', func: this.register, method: 'post' },
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		_next: NextFunction,
	): Promise<void> {
		console.log(body);
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password);
		// data.push(fs.readFileSync(resolve(__dirname, '../../unlock.zip')));
		this.ok(res, newUser);
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(body);
		next(new HTTPError(401, 'Authorization error!', 'login'));
	}
}
