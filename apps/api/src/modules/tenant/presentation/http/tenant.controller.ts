/* eslint-disable @typescript-eslint/no-unsafe-call */
// apps/api/src/modules/tenant/presentation/http/tenant.controller.ts

import { Public } from "@inbox/shared";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { CreateTenantUseCase } from "../../application/use-cases/create-tenant.usecase";
import type { CreateTenantDto } from "../dtos/create-tenant.dto";

// rota pública (não exige JWT)
@Controller("tenants")
export class TenantController {
	constructor(private readonly createTenant: CreateTenantUseCase) {}

	@Public()
	@HttpCode(HttpStatus.CREATED)
	@Post()
	create(@Body() dto: CreateTenantDto) {
		return this.createTenant.execute({
			name: dto.name,
			slug: dto.slug,
			adminEmail: dto.adminEmail,
			adminCpf: dto.adminCpf,
			adminUsername: dto.adminUsername,
			adminName: dto.adminName,
			adminPassword: dto.adminPassword,
		});
	}
}
