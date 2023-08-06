# Base image.
FROM node:20-alpine

# Change working dir.
WORKDIR /mnt/client

# Install dependencies based off package files.
COPY --chown=node pnpm-lock.yaml ./
RUN pnpm i

# Copy everything else and build the application.
COPY --chown=node . .

# Expose the port.
EXPOSE 3000

# Start the application.
CMD ["pnpm", "start"]
