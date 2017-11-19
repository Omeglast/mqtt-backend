FROM node:8-alpine
MAINTAINER Julien MERCIER <devci@j3ck3l.me>

COPY . /app

WORKDIR /app

RUN npm install

CMD npm start