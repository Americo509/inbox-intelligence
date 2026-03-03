import type { AuthUser } from "../../domain/models/auth-user.model";

export interface UserEntity {
	id: number;
	email: string;
	username: string;
	cpf: string;
	name: string;
	passwordHash: string;
	role: string;
	tenantId: string;
}

export interface CreateUserInput {
	email: string;
	username: string;
	cpf: string;
	name: string;
	passwordHash: string;
	role: string;
	tenantId: string;
}

export abstract class UserRepositoryPort {
	abstract findByCpf(cpf: string): Promise<AuthUser | null>;
	abstract create(input: CreateUserInput): Promise<UserEntity>;
	abstract findById(id: number): Promise<AuthUser | null>;
}
