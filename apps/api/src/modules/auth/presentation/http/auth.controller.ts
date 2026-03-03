import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { LoginUseCase } from "../../application/use-cases/login.usecase";
import type { LogoutUseCase } from "../../application/use-cases/logout.usecase";
import type { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.usecase";
import type { RefreshDto } from "./dtos/refresh.dto";
import type { SignInDto } from "./dtos/sign-in.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly login: LoginUseCase,
		private readonly refresh: RefreshTokenUseCase,
		private readonly logout: LogoutUseCase,
	) {}

	@HttpCode(HttpStatus.OK)
	@Post("login")
	signIn(@Body() dto: SignInDto) {
		return this.login.signIn(dto.cpf, dto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post("refresh")
	refreshToken(@Body() dto: RefreshDto) {
		return this.refresh.execute(dto.refreshToken);
	}

	@HttpCode(HttpStatus.OK)
	@Post("logout")
	async logoutSession(@Body() dto: RefreshDto) {
		await this.logout.execute(dto.refreshToken);
		return { ok: true };
	}
}
