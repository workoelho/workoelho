FROM oven/bun:1.1-alpine

ENV NODE_ENV=production
EXPOSE 5678
CMD ["bun", "start"]

WORKDIR /app/api

COPY package.json bun.lockb .
RUN bun install

COPY . .