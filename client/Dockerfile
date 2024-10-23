FROM node:22.6-alpine

ENV NODE_ENV=production
EXPOSE 1234
CMD ["npm", "start"]

WORKDIR /app/client

COPY package*.json .
RUN npm ci --include=dev

COPY . .
RUN npm run build