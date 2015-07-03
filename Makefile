REPORTER = list
MOCHA_OPTS = --ui tdd

test:
	clear
	echo Starting test **********************
	NODE_ENV=test ./node_modules/mocha/bin/mocha  test/*.js
	echo Ending test
.PHONY: test