.PHONY: dev build ics clean

dev:
	docker compose up dev

build:
	docker compose run --rm build

ics:
	docker compose run --rm ics

clean:
	docker compose down -v
	rm -rf dist
