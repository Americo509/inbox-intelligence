import { IsString, MinLength } from "class-validator";

export class SignInDto {
	@IsString()
	cpf!: string;

	@IsString()
	@MinLength(6)
	password!: string;
}
