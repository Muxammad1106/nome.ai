COMPOSE ?= docker compose
PROJECT_ROOT := $(CURDIR)
VENV_DIR ?= $(PROJECT_ROOT)/.venv
VENV_BIN := $(VENV_DIR)/bin
VENV_ACTIVATE := . $(VENV_BIN)/activate
PYTHON ?= $(VENV_BIN)/python
PIP ?= $(VENV_BIN)/pip
NPM ?= npm
APP ?=
MIGRATION ?=
MANAGE := cd backend && $(VENV_ACTIVATE) && $(PYTHON) manage.py

.PHONY: up down logs backend frontend install-backend install-frontend makemigrations migrate downgrade reset fmt clean

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down --remove-orphans

logs:
	$(COMPOSE) logs -f

backend:
	$(MANAGE) runserver 0.0.0.0:8000

frontend:
	cd frontend && $(NPM) run dev

install-backend:
	cd backend && $(VENV_ACTIVATE) && $(PIP) install -r requirements.txt

install-frontend:
	cd frontend && $(NPM) install

makemigrations:
	$(MANAGE) makemigrations

migrate:
	$(MANAGE) migrate

downgrade:
	@if [ -z "$(APP)" ] || [ -z "$(MIGRATION)" ]; then \
		echo "Provide APP and MIGRATION, e.g. make downgrade APP=apps.core MIGRATION=zero"; \
	else \
		$(MANAGE) migrate $(APP) $(MIGRATION); \
	fi

reset:
	$(MANAGE) migrate --noinput
	$(MANAGE) flush --noinput
	$(MANAGE) migrate --noinput

clean:
	$(COMPOSE) down --volumes --remove-orphans
