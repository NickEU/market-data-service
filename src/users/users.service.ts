import { inject, injectable } from 'inversify';
import { CONSTANTS } from '../common/constants';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	private salt: number;

	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {
		this.salt = Number(this.configService.get(CONSTANTS.SALT) ?? 10);
	}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		// service = business logic, interaction with the repository
		// return null if user exists
		// if a user doesn't exist - create and return
		const newUser = new User(email, name);
		await newUser.setPassword(password, this.salt);
		console.log(newUser);
		return newUser;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
