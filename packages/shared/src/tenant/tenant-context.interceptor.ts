import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Observable } from "rxjs";
import { TenantContext } from "./tenant-context";

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();

		// vem do JwtStrategy.validate()
		const user = req.user as
			| { tenantId?: string; userId?: number; role?: string }
			| undefined;

		// Você pode permitir rotas públicas sem tenant
		const tenantId = user?.tenantId;

		return TenantContext.run(
			{ tenantId: tenantId ?? "", userId: user?.userId, role: user?.role },
			() => next.handle(),
		);
	}
}
