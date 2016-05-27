#
# Vars
#

BIN = ./node_modules/.bin
.DEFAULT_GOAL := all

#
# Tasks
#

node_modules: package.json
	@npm install
	@touch node_modules

test: node_modules
	babel test/*.js

dev:
	@${BIN}/unv dev

build-staging:
	NODE_ENV=staging ${BIN}/unv build --base //d13gu65ha1vakg.cloudfront.net --server src/server/lambda.js

validate: node_modules
	@standard

deploy-staging: build-staging deploy-assets deploy-function

deploy-function:
	apex deploy

deploy-assets:
	aws s3 sync assets s3://assets.weo.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --cache-control="public, max-age=31536000"

all: validate test

#
# Phony
#

.PHONY: test validate clean build deploy-assets
