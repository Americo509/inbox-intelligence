import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { Role } from "../../domain/enums/role.enum";
import type { AuthUser } from "../../domain/models/auth-user.model";
import type {
	CreateUserInput,
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
	constructor(private readonly userRepository: UserRepositoryPort) {}

	async register(input: RegisterInput): Promise<AuthUser> {
		// validate if the user already exists
		const existingUser = await this.userRepository.findByCpf(input.cpf);
		if (existingUser) {
			throw new Error("User already exists");
		}

		// Hash the password before saving it to the database
		const passwordHash = await this.hashPassword(input.password);

		const toCreate: CreateUserInput = {
			email: input.email,
			username: input.username,
			cpf: input.cpf,
			name: input.name,
			birthdate: input.birthdate,
			gender: input.gender,
			passwordHash,
			role: Role.USER, // Default role for new users
		};

		const user = await this.userRepository.create(toCreate);
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
