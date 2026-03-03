import { AsyncLocalStorage } from "async_hooks";

export type TenantContextStore = {
	tenantId: string;
	userId?: number;
	role?: string;
};

const als = new AsyncLocalStorage<TenantContextStore>();

export const TenantContext = {
	run<T>(store: TenantContextStore, fn: () => T): T {
		return als.run(store, fn);
	},
	get(): TenantContextStore | undefined {
		return als.getStore();
	},
	tenantId(): string | undefined {
		return als.getStore()?.tenantId;
	},
};
