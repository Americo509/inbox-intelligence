SHELL := /bin/bash

.PHONY: help
help:
	@echo "Targets:"
	@echo "  make db-up        -> sobe postgres+redis"
	@echo "  make db-down      -> derruba containers"
	@echo "  make db-logs      -> logs"
	@echo "  make dev          -> roda tudo em dev (pnpm)"
	@echo "  make install      -> instala deps"
	@echo "  make db-reset     -> dropa volumes (PERDE DADOS)"

.PHONY: install
install:
	pnpm i

.PHONY: db-up
db-up:
	docker compose --env-file .env -f infra/docker-compose.yml up -d

.PHONY: db-down
db-down:
	docker compose -f infra/docker-compose.yml down

.PHONY: db-logs
db-logs:
	docker compose -f infra/docker-compose.yml logs -f --tail=200

.PHONY: db-reset
db-reset:
	docker compose -f infra/docker-compose.yml down -v

.PHONY: dev
dev:
	pnpm dev