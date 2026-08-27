.PHONY: setup dev build test lint clean docker-up docker-down

setup:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

clean:
	rm -rf dist node_modules
