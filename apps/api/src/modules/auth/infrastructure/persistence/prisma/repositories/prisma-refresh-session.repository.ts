/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { PrismaService } from "@inbox/db";
import { Injectable } from "@nestjs/common";
import type {
	CreateRefreshSessionInput,
	RefreshSessionModel,
	RefreshSessionRepositoryPort,
} from "../../../../application/ports/refresh-session-repository.port";

@Injectable()
export class PrismaRefreshSessionRepository
	implements RefreshSessionRepositoryPort
{
	constructor(private readonly prisma: PrismaService) {}

	async create(input: CreateRefreshSessionInput): Promise<RefreshSessionModel> {
		return await this.prisma.refreshSession.create({
			data: {
				id: input.id,
				userId: input.userId,
				refreshTokenHash: input.refreshTokenHash,
				expiresAt: input.expiresAt,
			},
		});
	}

	async findById(id: string): Promise<RefreshSessionModel | null> {
		return await this.prisma.refreshSession.findUnique({ where: { id } });
	}

	async revoke(sessionId: string, revokedAt: Date = new Date()): Promise<void> {
		await this.prisma.refreshSession.update({
			where: { id: sessionId },
			data: { revokedAt },
		});
	}

	async rotate(
		sessionId: string,
		refreshTokenHash: string,
		expiresAt: Date,
	): Promise<void> {
		await this.prisma.refreshSession.update({
			where: { id: sessionId },
			data: { refreshTokenHash, expiresAt },
		});
	}
}
