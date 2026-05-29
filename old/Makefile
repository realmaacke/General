# Force use zsh
SHELL := /bin/zsh

.PHONY: up down down-hard ps logs restart restartbuild

COMPOSE = docker compose -f $(HOME)/dev/general/docker-compose.yml

up:
	$(COMPOSE) up -d $(filter-out $@,$(MAKECMDGOALS))

down:
	$(COMPOSE) down -v $(filter-out $@,$(MAKECMDGOALS))

# Custom ps command
ps:
	dcps

logs:
	$(COMPOSE) logs -f $(filter-out $@,$(MAKECMDGOALS))

restart:
	$(COMPOSE) restart $(filter-out $@,$(MAKECMDGOALS))

restartBuild:
	$(COMPOSE) up -d --build --no-deps $(filter-out $@,$(MAKECMDGOALS))
