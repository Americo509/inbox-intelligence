import { PrismaService } from "@inbox/db";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PasswordHasherPort } from "./application/ports/password-hasher.port";
import { RefreshSessionRepositoryPort } from "./application/ports/refresh-session-repository.port";
import { TokenServicePort } from "./application/ports/token-service.port";
import { UserRepositoryPort } from "./application/ports/user-repository.port";
import { LoginUseCase } from "./application/use-cases/login.usecase";
import { LogoutUseCase } from "./application/use-cases/logout.usecase";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.usecase";
import { RegisterUseCase } from "./application/use-cases/register.usecase";
import { Argon2Hasher } from "./infrastructure/crypto/argon2-hashers.service";
import { PrismaRefreshSessionRepository } from "./infrastructure/persistence/prisma/repositories/prisma-refresh-session.repository";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma/repositories/prisma-user.repository";
import { JwtTokenService } from "./infrastructure/tokens/jwt-token.service";
import { AuthController } from "./presentation/http/auth.controller";
import { JwtStrategy } from "./presentation/http/strategies/jwt.strategy";

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET ?? "dev-secret",
			signOptions: { expiresIn: "60s" },
		}),
	],
	providers: [
		JwtStrategy,
		RegisterUseCase,
		LoginUseCase,
		RefreshTokenUseCase,
		LogoutUseCase,
		PrismaService,
		{ provide: UserRepositoryPort, useClass: PrismaUserRepository },
		{ provide: PasswordHasherPort, useClass: Argon2Hasher },
		{ provide: TokenServicePort, useClass: JwtTokenService },
		{
			provide: RefreshSessionRepositoryPort,
			useClass: PrismaRefreshSessionRepository,
		},
	],
	controllers: [AuthController],
	exports: [
		PrismaService,
		UserRepositoryPort,
		RefreshSessionRepositoryPort,
		PasswordHasherPort,
		TokenServicePort,
	],
})
export class AuthModule {}
