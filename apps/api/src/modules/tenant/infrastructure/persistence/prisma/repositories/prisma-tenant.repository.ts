/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { PrismaService } from "@inbox/db";
import { Injectable } from "@nestjs/common";
import type {
	CreateTenantInput,
	TenantModel,
	TenantRepositoryPort,
} from "../../../../application/ports/tenant-repository.port";

@Injectable()
export class PrismaTenantRepository implements TenantRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async findBySlug(slug: string): Promise<TenantModel | null> {
		return await this.prisma.tenant.findUnique({ where: { slug } });
	}

	async create(input: CreateTenantInput): Promise<TenantModel> {
		return await this.prisma.tenant.create({
			data: {
				name: input.name,
				slug: input.slug,
			},
		});
	}
}
