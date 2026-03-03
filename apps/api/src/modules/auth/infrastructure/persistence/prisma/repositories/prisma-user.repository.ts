/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { PrismaService } from "@inbox/db";
import { Injectable } from "@nestjs/common";
import type { AuthUser } from "../../../../../../modules/auth/domain/models/auth-user.model";
import type {
	CreateUserInput,
	UserEntity,
	UserRepositoryPort,
} from "../../../../application/ports/user-repository.port";

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: number): Promise<AuthUser | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				cpf: true,
				passwordHash: true,
				role: true,
			},
		});

		if (!user) return null;
		return {
			id: user.id,
			cpf: user.cpf,
			passwordHash: user.passwordHash,
			role: user.role,
		};
	}

	async findByCpf(cpf: string): Promise<AuthUser | null> {
		const user = await this.prisma.user.findUnique({
			where: { cpf },
			select: {
				id: true,
				cpf: true,
				passwordHash: true,
				role: true,
			},
		});

		if (!user) return null;

		return {
			id: user.id,
			cpf: user.cpf,
			passwordHash: user.passwordHash,
			role: user.role,
		};
	}

	async create(input: CreateUserInput): Promise<UserEntity> {
		const user = await this.prisma.user.create({
			data: {
				email: input.email,
				username: input.username,
				cpf: input.cpf,
				passwordHash: input.passwordHash,
				role: input.role,
			},
			select: {
				id: true,
				email: true,
				passwordHash: true,
				role: true,
			},
		});

		return {
			id: user.id,
			email: user.email,
			passwordHash: user.passwordHash,
			username: input.username,
			cpf: input.cpf,
			name: input.name,
			birthdate: input.birthdate,
			gender: input.gender,
			role: user.role,
		};
	}
}
