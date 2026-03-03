import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import type { PasswordHasherPort } from "../../application/ports/password-hasher.port";

@Injectable()
export class Argon2Hasher implements PasswordHasherPort {
	async hash(plain: string): Promise<string> {
		return argon2.hash(plain, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16, // 64MB
			timeCost: 3,
			parallelism: 1,
		});
	}

	async verify(hash: string, plain: string): Promise<boolean> {
		return argon2.verify(hash, plain);
	}
}
