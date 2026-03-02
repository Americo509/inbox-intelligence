import { PrismaClient } from "@prisma/client";

declare global {
	// evita múltiplas instâncias no dev/hot-reload
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient | undefined;
}

export const prisma =
	globalThis.__prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
