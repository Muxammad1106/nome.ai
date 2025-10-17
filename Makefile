COMPOSE ?= docker compose
PYTHON ?= python3
PIP ?= pip3
NPM ?= npm

.PHONY: up down logs backend frontend install-backend install-frontend fmt clean

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down --remove-orphans

logs:
	$(COMPOSE) logs -f

backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && $(NPM) run dev

install-backend:
	cd backend && $(PIP) install -r requirements.txt

install-frontend:
	cd frontend && $(NPM) install

clean:
	$(COMPOSE) down --volumes --remove-orphans
