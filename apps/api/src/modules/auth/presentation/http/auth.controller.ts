/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Public } from "@inbox/shared";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
} from "@nestjs/common";
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

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("login")
	signIn(@Body() dto: SignInDto) {
		return this.login.signIn(dto.cpf, dto.password);
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("refresh")
	refreshToken(@Body() dto: RefreshDto) {
		return this.refresh.execute(dto.refreshToken);
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("logout")
	async logoutSession(@Body() dto: RefreshDto) {
		await this.logout.execute(dto.refreshToken);
		return { ok: true };
	}

	@Get("me")
	me(@Req() req: any) {
		return {
			user: req.user,
			tenantFromHeader: req.header("x-tenant-id"),
		};
	}
}
