FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json ./
COPY knexfile.ts ./
COPY src/ ./src/

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/blog-api/health || exit 1

CMD ["node", "build/src/server.js"]
