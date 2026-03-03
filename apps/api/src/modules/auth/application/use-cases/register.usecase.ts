import { Inject, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { Role } from "../../domain/enums/role.enum";
import type { AuthUser } from "../../domain/models/auth-user.model";
import { PasswordHasherPort } from "../ports/password-hasher.port";
import {
	type CreateUserInput,
	UserRepositoryPort,
} from "../ports/user-repository.port";

export interface RegisterInput {
	email: string;
	username: string;
	cpf: string;
	name: string;
	birthdate: Date;
	gender: string;
	password: string;
}

@Injectable()
export class RegisterUseCase {
	constructor(
		@Inject(UserRepositoryPort)
		private readonly users: UserRepositoryPort,

		@Inject(PasswordHasherPort)
		private readonly hasher: PasswordHasherPort,
	) {}

	async register(input: RegisterInput): Promise<AuthUser> {
		// validate if the user already exists
		const existingUser = await this.users.findByCpf(input.cpf);
		if (existingUser) {
			throw new Error("User already exists");
		}

		// Hash the password before saving it to the database
		const passwordHash = await this.hasher.hash(input.password);

		const toCreate: CreateUserInput = {
			email: input.email,
			username: input.username,
			cpf: input.cpf,
			name: input.name,
			passwordHash,
			role: Role.USER, // Default role for new users
			tenantId: "default", // You might want to assign a default tenant or handle this differently
		};

		const user = await this.users.create(toCreate);
		return user;
	}

	private async hashPassword(password: string): Promise<string> {
		const hash = await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16, // 64 MB
			timeCost: 3,
			parallelism: 1,
		});
		return hash;
	}
}
