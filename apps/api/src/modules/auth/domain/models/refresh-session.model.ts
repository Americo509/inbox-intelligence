export interface RefreshSession {
	id: string;
	userId: number;
	refreshTokenHash: string;
	revokedAt: Date | null;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
