export interface TenantModel {
	id: string;
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateTenantInput {
	name: string;
	slug: string;
}

export abstract class TenantRepositoryPort {
	abstract findBySlug(slug: string): Promise<TenantModel | null>;
	abstract create(input: CreateTenantInput): Promise<TenantModel>;
}
