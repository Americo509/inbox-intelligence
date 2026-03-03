import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { PasswordHasherPort } from "../ports/password-hasher.port";
import type { RefreshSessionRepositoryPort } from "../ports/refresh-session-repository.port";
import type { TokenServicePort } from "../ports/token-service.port";
import type { UserRepositoryPort } from "../ports/user-repository.port";

function parseRefreshToken(refreshToken: string): {
	sessionId: string;
	secret: string;
} {
	const parts = refreshToken.split(".");
	if (parts.length !== 2)
		throw new UnauthorizedException("Invalid refresh token");
	const [sessionId, secret] = parts;
	if (!sessionId || !secret)
		throw new UnauthorizedException("Invalid refresh token");
	return { sessionId, secret };
}

@Injectable()
export class RefreshTokenUseCase {
	constructor(
		private readonly sessions: RefreshSessionRepositoryPort,
		private readonly hasher: PasswordHasherPort,
		private readonly tokens: TokenServicePort,
		private readonly users: UserRepositoryPort,
	) {}

	async execute(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { sessionId, secret } = parseRefreshToken(refreshToken);

		const session = await this.sessions.findById(sessionId);
		if (!session || session.revokedAt)
			throw new UnauthorizedException("Invalid refresh token");
		if (session.expiresAt.getTime() <= Date.now())
			throw new UnauthorizedException("Refresh token expired");

		const ok = await this.hasher.verify(session.refreshTokenHash, secret);
		if (!ok) throw new UnauthorizedException("Invalid refresh token");

		const user = await this.users.findById(session.userId);
		if (!user) throw new UnauthorizedException("User not found");

		// rotação: gera novo secret/hash, mas mantém o mesmo sessionId
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const newSecret = (
			await this.tokens.generateRefreshToken()
		).refreshToken.split(".")[1]!;
		const newRefreshToken = `${sessionId}.${newSecret}`;
		const newRefreshTokenHash = await this.hasher.hash(newSecret);

		const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		await this.sessions.rotate(sessionId, newRefreshTokenHash, newExpiresAt);

		const accessToken = await this.tokens.generateAccessToken({
			sub: user.id,
			cpf: user.cpf,
			role: user.role,
			tenantId: user.tenantId,
		});

		return { accessToken, refreshToken: newRefreshToken };
	}
}
