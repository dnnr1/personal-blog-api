FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build

USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["sh", "-c", "npx knex migrate:latest --knexfile build/knexfile.js && node build/src/server.js"]
