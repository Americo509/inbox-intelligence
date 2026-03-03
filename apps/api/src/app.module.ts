/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { TenantContextInterceptor, TenantGuard } from "@inbox/shared";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/presentation/http/guards/jwt-auth.guard";
import { TenantModule } from "./modules/tenant/tenant.module";
@Module({
	imports: [AuthModule, TenantModule],
	providers: [
		// 1) garante JWT primeiro (req.user existe)
		{ provide: APP_GUARD, useClass: JwtAuthGuard },

		// 2) bloqueia cross-tenant
		{ provide: APP_GUARD, useClass: TenantGuard },

		// 3) injeta no contexto (AsyncLocalStorage)
		{ provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
	],
})
export class AppModule {}
