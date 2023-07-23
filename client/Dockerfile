# Base image.
FROM node:20-alpine

# Change working dir.
WORKDIR /app

# Install dependencies based off package files.
COPY --chown=node package*.json ./
RUN npm ci

# Copy everything else and build the application.
COPY --chown=node . .

# Expose the port.
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]
