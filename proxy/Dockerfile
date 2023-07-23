# Base builder image.
FROM caddy:2-builder AS builder

# Add extensions.
RUN xcaddy build \
    --with github.com/RussellLuo/caddy-ext/ratelimit

# Base image.
FROM caddy:2-alpine

# Copy Caddy binary.
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
