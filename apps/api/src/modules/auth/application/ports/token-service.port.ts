export interface TokenPayload {
	sub: number;
	cpf: string;
	role: string;
}

export abstract class TokenServicePort {
	abstract generateAccessToken(payload: TokenPayload): Promise<string>;

	/**
	 * refreshToken = `${sessionId}.${secret}`
	 * refreshTokenHash = hash(secret)
	 */
	abstract generateRefreshToken(): Promise<{
		sessionId: string;
		refreshToken: string;
		refreshTokenHash: string;
	}>;
}
