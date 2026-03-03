import { Injectable } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import { randomBytes, randomUUID } from "crypto";
import type { PasswordHasherPort } from "../../application/ports/password-hasher.port";
import type {
	TokenPayload,
	TokenServicePort,
} from "../../application/ports/token-service.port";

@Injectable()
export class JwtTokenService implements TokenServicePort {
	constructor(
		private readonly jwt: JwtService,
		private readonly hasher: PasswordHasherPort,
	) {}

	async generateAccessToken(payload: TokenPayload): Promise<string> {
		return this.jwt.signAsync(payload);
	}

	async generateRefreshToken(): Promise<{
		sessionId: string;
		refreshToken: string;
		refreshTokenHash: string;
	}> {
		const sessionId = randomUUID(); // forte e único
		const secret = randomBytes(32).toString("hex");

		const refreshToken = `${sessionId}.${secret}`;
		const refreshTokenHash = await this.hasher.hash(secret);

		return { sessionId, refreshToken, refreshTokenHash };
	}
}
