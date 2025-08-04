.PHONY: help build up down clean logs test test-backend test-frontend test-all test-watch lint ci

# Default target
all: up

help:
	@echo "Task Management System - Docker Commands"
	@echo ""
	@echo "🚀 Application Commands:"
	@echo "  make          - Build and start the application"
	@echo "  make up       - Build and start the application"
	@echo "  make down     - Stop the application"
	@echo "  make clean    - Stop and remove containers, networks, and images"
	@echo "  make logs     - Show application logs"
	@echo "  make rebuild  - Clean rebuild of the application"
	@echo ""
	@echo "🔧 Development Commands:"
	@echo "  make dev      - Start development environment with hot reloading"
	@echo "  make dev-down - Stop development environment"
	@echo "  make dev-logs - Show development logs"
	@echo ""
	@echo "🧪 Testing Commands:"
	@echo "  make test           - Run all tests (backend + frontend)"
	@echo "  make test-backend   - Run backend tests only"
	@echo "  make test-frontend  - Run frontend tests only"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-coverage  - Run tests with coverage report"
	@echo ""
	@echo "🔍 Quality Commands:"
	@echo "  make lint           - Run linting for both frontend and backend"
	@echo "  make lint-backend   - Run backend linting only"
	@echo "  make lint-frontend  - Run frontend linting only"
	@echo "  make ci             - Run full CI pipeline (lint + test)"
	@echo ""
	@echo "Application will be available at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

build:
	@echo "Building Docker images..."
	docker-compose build

up: build
	@echo "Starting Task Management System..."
	docker-compose up -d
	@echo ""
	@echo "✅ Application is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"
	@echo ""
	@echo "Use 'make logs' to view logs or 'make down' to stop"

down:
	@echo "Stopping Task Management System..."
	docker-compose down

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down --rmi all --volumes --remove-orphans
	@echo "✅ Cleanup complete"

logs:
	docker-compose logs -f

rebuild: clean up

# Testing Commands
test: test-backend test-frontend
	@echo "✅ All tests completed!"

test-backend:
	@echo "🧪 Running backend tests..."
	docker-compose -f docker-compose.test.yml build backend-test
	docker-compose -f docker-compose.test.yml run --rm backend-test
	@echo "✅ Backend tests completed!"

test-frontend:
	@echo "🧪 Running frontend tests..."
	docker-compose -f docker-compose.test.yml build frontend-test
	docker-compose -f docker-compose.test.yml run --rm frontend-test
	@echo "✅ Frontend tests completed!"

test-all: test

test-watch:
	@echo "🧪 Running tests in watch mode..."
	@echo "Choose: [1] Backend [2] Frontend [3] Both"
	@read choice; \
	case $$choice in \
		1) docker-compose -f docker-compose.test.yml run --rm backend-test npm run test:watch ;; \
		2) docker-compose -f docker-compose.test.yml run --rm frontend-test npm run test:watch ;; \
		3) docker-compose -f docker-compose.test.yml up backend-test frontend-test ;; \
		*) echo "Invalid choice" ;; \
	esac

test-coverage:
	@echo "🧪 Running tests with coverage..."
	docker-compose -f docker-compose.test.yml run --rm backend-test npm run test:coverage
	docker-compose -f docker-compose.test.yml run --rm frontend-test npm run test:coverage
	@echo "✅ Coverage reports generated!"

# Linting Commands
lint: lint-backend lint-frontend
	@echo "✅ All linting completed!"

lint-backend:
	@echo "🔍 Running backend linting..."
	docker-compose -f docker-compose.test.yml build backend-lint
	docker-compose -f docker-compose.test.yml run --rm backend-lint
	@echo "✅ Backend linting completed!"

lint-frontend:
	@echo "🔍 Running frontend linting..."
	docker-compose -f docker-compose.test.yml build frontend-lint
	docker-compose -f docker-compose.test.yml run --rm frontend-lint
	@echo "✅ Frontend linting completed!"

# CI Pipeline
ci: lint test
	@echo "🎉 CI Pipeline completed successfully!"

# Development Commands
dev:
	@echo "Starting development environment with hot reloading..."
	docker-compose -f docker-compose.dev.yml up --build
	@echo ""
	@echo "✅ Development environment is running!"
	@echo "Frontend: http://localhost:3000 (with hot reloading)"
	@echo "Backend:  http://localhost:3001"

dev-down:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-logs-backend:
	docker-compose -f docker-compose.dev.yml logs -f backend

dev-logs-frontend:
	docker-compose -f docker-compose.dev.yml logs -f frontend

# Local Development (Frontend only)
dev-local:
	@echo "Starting backend in Docker and frontend locally..."
	@echo "Make sure you have Node.js installed locally"
	docker-compose up -d backend
	@echo "Backend started at http://localhost:3001"
	@echo "Now run: cd frontend && npm install && npm run dev"

dev-local-stop:
	docker-compose down

# Test cleanup
test-clean:
	@echo "🧹 Cleaning up test containers..."
	docker-compose -f docker-compose.test.yml down --rmi all --volumes --remove-orphans
	@echo "✅ Test cleanup complete!"
