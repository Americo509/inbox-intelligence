export interface AuthUser {
	id: number;
	cpf: string;
	passwordHash: string;
	role: string;
	tenantId: string;
}
