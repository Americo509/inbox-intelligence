// apps/api/src/modules/tenant/tenant.module.ts

import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TenantRepositoryPort } from "./application/ports/tenant-repository.port";
import { CreateTenantUseCase } from "./application/use-cases/create-tenant.usecase";
import { PrismaTenantRepository } from "./infrastructure/persistence/prisma/repositories/prisma-tenant.repository";
import { TenantController } from "./presentation/http/tenant.controller";

@Module({
	imports: [AuthModule],
	controllers: [TenantController],
	providers: [
		CreateTenantUseCase,
		{ provide: TenantRepositoryPort, useClass: PrismaTenantRepository },
	],
})
export class TenantModule {}
