# Base image.
FROM node:20-alpine

# Change working dir.
WORKDIR /mnt/app

# Install dependencies.
COPY --chown=node package*.json ./
RUN npm ci

# Expose the port.
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]
