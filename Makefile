install:
	npm install

lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npx jest

watch:
	npx jest --watch

build:
	rm -rf dist
	npm run build

test-coverage:
	npm test -- --coverage