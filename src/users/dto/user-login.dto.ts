import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Please provide a valid email!' })
	email: string;
	@IsString({ message: 'Please provide a password!' })
	password: string;
}
