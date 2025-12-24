FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/build/src/db/migrations ./src/db/migrations
COPY --from=builder /app/build/knexfile.js ./knexfile.js

EXPOSE 3000

CMD ["node", "build/src/server.js"]
