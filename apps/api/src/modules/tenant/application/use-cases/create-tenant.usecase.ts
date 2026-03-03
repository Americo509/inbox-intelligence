// apps/api/src/modules/tenant/application/use-cases/create-tenant.usecase.ts

import { BadRequestException, Injectable } from "@nestjs/common";
import type { PasswordHasherPort } from "../../../auth/application/ports/password-hasher.port";
import type { RefreshSessionRepositoryPort } from "../../../auth/application/ports/refresh-session-repository.port";
import type { TokenServicePort } from "../../../auth/application/ports/token-service.port";
import type { UserRepositoryPort } from "../../../auth/application/ports/user-repository.port";
import type { TenantRepositoryPort } from "../ports/tenant-repository.port";

@Injectable()
export class CreateTenantUseCase {
	constructor(
		private readonly tenants: TenantRepositoryPort,
		private readonly users: UserRepositoryPort,
		private readonly hasher: PasswordHasherPort,
		private readonly sessions: RefreshSessionRepositoryPort,
		private readonly tokens: TokenServicePort,
	) {}

	async execute(input: {
		name: string;
		slug: string;
		adminEmail: string;
		adminCpf: string;
		adminUsername: string;
		adminName: string;
		adminPassword: string;
	}): Promise<{ tenantId: string; accessToken: string; refreshToken: string }> {
		const existing = await this.tenants.findBySlug(input.slug);
		if (existing) throw new BadRequestException("Tenant slug already exists");

		const tenant = await this.tenants.create({
			name: input.name,
			slug: input.slug,
		});

		// valida duplicidades globais (CPF/email/username)
		const existingByCpf = await this.users.findByCpf(input.adminCpf);
		if (existingByCpf) throw new BadRequestException("CPF already registered");

		const passwordHash = await this.hasher.hash(input.adminPassword);

		// cria o admin no tenant
		const admin = await this.users.create({
			email: input.adminEmail,
			cpf: input.adminCpf,
			username: input.adminUsername,
			name: input.adminName,
			passwordHash,
			role: "ADMIN",
			tenantId: tenant.id,
		});

		// cria refresh session
		const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		const { sessionId, refreshToken, refreshTokenHash } =
			await this.tokens.generateRefreshToken();

		await this.sessions.create({
			id: sessionId,
			userId: admin.id,
			refreshTokenHash,
			expiresAt: refreshExpiresAt,
		});

		// access token já com tenantId
		const accessToken = await this.tokens.generateAccessToken({
			sub: admin.id,
			cpf: admin.cpf,
			role: admin.role,
			tenantId: tenant.id,
		});

		return { tenantId: tenant.id, accessToken, refreshToken };
	}
}
