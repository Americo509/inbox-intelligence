export interface RefreshSessionModel {
	id: string;
	userId: number;
	refreshTokenHash: string;
	revokedAt: Date | null;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateRefreshSessionInput {
	id: string;
	userId: number;
	refreshTokenHash: string;
	expiresAt: Date;
}

export abstract class RefreshSessionRepositoryPort {
	abstract create(
		input: CreateRefreshSessionInput,
	): Promise<RefreshSessionModel>;
	abstract findById(id: string): Promise<RefreshSessionModel | null>;
	abstract revoke(sessionId: string, revokedAt?: Date): Promise<void>;
	abstract rotate(
		sessionId: string,
		refreshTokenHash: string,
		expiresAt: Date,
	): Promise<void>;
}
