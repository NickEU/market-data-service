import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { CONSTANTS } from '../common/constants';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	private salt: number;

	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepo: IUsersRepository,
	) {
		this.salt = Number(this.configService.get(CONSTANTS.SALT) ?? 10);
	}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		// service = business logic, interaction with the repository
		// return null if user exists
		// if a user doesn't exist - create and return
		const existingUser = await this.usersRepo.find(email);
		if (existingUser) {
			return null;
		}

		const newUser = new User(email, name);
		await newUser.setPassword(password, this.salt);
		const creationResult = await this.usersRepo.create(newUser);
		return creationResult;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const { email, password: potentialPwd } = dto;
		const existingUser = await this.usersRepo.find(email);
		if (!existingUser) {
			return false;
		}
		const hash = existingUser.password;
		const passwordMatches = User.isValidPassword(potentialPwd, hash);
		return passwordMatches;
	}
}
