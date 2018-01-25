FROM node:9-alpine AS builder
LABEL maintainer="Julien MERCIER <devci@j3ck3l.me>"

# Build project

WORKDIR /home/node/app
COPY . .
RUN npm install && \
    npm run build

# Make the run container
#
FROM node:9-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Install deps for production only
COPY ./package* ./
RUN npm install && \
    npm cache clean --force

# Copy build source from builder stage
COPY --from=builder /home/node/app/dist ./dist

CMD npm run start-prod