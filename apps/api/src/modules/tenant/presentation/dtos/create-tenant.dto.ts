// apps/api/src/modules/tenant/presentation/dtos/create-tenant.dto.ts

import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateTenantDto {
	@IsString()
	name!: string;

	@IsString()
	slug!: string;

	@IsEmail()
	adminEmail!: string;

	@IsString()
	adminCpf!: string;

	@IsString()
	adminUsername!: string;

	@IsString()
	adminName!: string;

	@IsString()
	@MinLength(6)
	adminPassword!: string;
}
