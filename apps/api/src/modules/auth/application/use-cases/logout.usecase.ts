import { Injectable } from "@nestjs/common";
import type { RefreshSessionRepositoryPort } from "../ports/refresh-session-repository.port";

function parseSessionId(refreshToken: string): string {
	const [sessionId] = refreshToken.split(".");
	return sessionId ?? "";
}

@Injectable()
export class LogoutUseCase {
	constructor(private readonly sessions: RefreshSessionRepositoryPort) {}

	async execute(refreshToken: string): Promise<void> {
		const sessionId = parseSessionId(refreshToken);
		if (!sessionId) return;

		await this.sessions.revoke(sessionId);
	}
}
