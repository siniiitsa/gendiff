make install:
	npm install

make lint:
	npx eslint .

publish:
	npm publish --dry-run
