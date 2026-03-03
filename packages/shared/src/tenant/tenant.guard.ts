import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";

@Injectable()
export class TenantGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();

		const user = req.user as { tenantId?: string } | undefined;

		// Rotas públicas (sem JWT) passam
		if (!user?.tenantId) return true;

		const tenantFromHeader = req.header("x-tenant-id") as string | undefined;

		if (!tenantFromHeader) {
			throw new ForbiddenException("Missing X-Tenant-Id header");
		}

		if (tenantFromHeader !== user.tenantId) {
			throw new ForbiddenException("Cross-tenant access blocked");
		}

		req.tenantId = user.tenantId;

		return true;
	}
}
