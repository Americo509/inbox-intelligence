import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { PasswordHasherPort } from "../ports/password-hasher.port";
import type { RefreshSessionRepositoryPort } from "../ports/refresh-session-repository.port";
import type { TokenServicePort } from "../ports/token-service.port";
import type { UserRepositoryPort } from "../ports/user-repository.port";

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly users: UserRepositoryPort,
		private readonly hasher: PasswordHasherPort,
		private readonly sessions: RefreshSessionRepositoryPort,
		private readonly tokens: TokenServicePort,
	) {}

	async signIn(
		cpf: string,
		password: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const user = await this.users.findByCpf(cpf);
		if (!user) throw new UnauthorizedException("Invalid credentials");

		const ok = await this.hasher.verify(user.passwordHash, password);
		if (!ok) throw new UnauthorizedException("Invalid credentials");

		const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		const { sessionId, refreshToken, refreshTokenHash } =
			await this.tokens.generateRefreshToken();

		await this.sessions.create({
			id: sessionId,
			userId: user.id,
			refreshTokenHash,
			expiresAt: refreshExpiresAt,
		});

		const accessToken = await this.tokens.generateAccessToken({
			sub: user.id,
			cpf: user.cpf,
			role: user.role,
		});

		return { accessToken, refreshToken };
	}
}
