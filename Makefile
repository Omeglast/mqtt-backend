.PHONY: install npm up stop down

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

npm:
	@${NPM_CMD} ${CMD}

build:
	@docker build -t jeckel/omeglast-server:latest .