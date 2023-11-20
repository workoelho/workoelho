# Base image.
FROM node:20-alpine

# Change working dir.
WORKDIR /mnt/app

# Copy the source code.
COPY --chown=node . .

# Install dependencies.
RUN npm ci

# Expose the port.
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]
