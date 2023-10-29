# Base image.
FROM node:20-alpine

# Read user and group ID from arguments.
ARG UID=1000
ARG GID=1000

# Set user.
USER $UID:$GID

# Change working dir.
WORKDIR /mnt/app

# Install dependencies based off package files.
COPY --chown=node package*.json ./
RUN npm ci

# Copy everything else and build the application.
COPY --chown=node . .

# Expose the port.
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]
