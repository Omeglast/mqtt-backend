.PHONY: install npm up stop down

IMAGE=jeckel/omeglast-server
BRANCH:=$(shell git rev-parse --abbrev-ref HEAD)
ifeq ($(BRANCH),master)
	TAG:=latest
else
	TAG:=$(BRANCH)
endif

# Detect OS to adapt to local user
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
	USER:=
else
	UID:=$(shell id -u `whoami`)
	GID:=$(shell id -g `whoami`)
	USER:=--user "$(UID):$(GID)"
endif

NPM_CMD=docker run --rm -it -v `pwd`:/app --workdir /app $(USER) node:8-alpine npm

install:
	@${NPM_CMD} install

setup:
	${NPM_CMD} run setup

npm:
	@${NPM_CMD} ${CMD}

build:
	@docker build -t ${IMAGE}:${TAG} .

lint:
	@${NPM_CMD} run eslint
