# Base image.
FROM golang:1.20.2-alpine

# Install make.
RUN apk add --no-cache make

# Install air for live reloading.
RUN go install github.com/cosmtrek/air@latest

# Set working directory.
WORKDIR /app

# Copy manifest and download dependencies.
COPY go.* ./
RUN go mod download

# Copy the rest of the source.
COPY . .

# Build the application.
RUN make

# Expose the port.
EXPOSE 1234

# Run the application.
CMD [ "make", "start" ]
