/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDateString, IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(3)
	username!: string;

	@IsString()
	cpf!: string;

	@IsString()
	name!: string;

	@IsDateString()
	birthdate!: string;

	@IsString()
	gender!: string;

	@IsString()
	@MinLength(6)
	password!: string;
}
