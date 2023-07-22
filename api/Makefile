CGO_ENABLED=0
GOOS=linux

build: lint test
	@go build -a -ldflags '-extldflags "-static"' -o build/cli .

test: lint
	@go test ./...

lint: main.go
	@go fmt ./...
	@go vet ./...
	@go fix ./...

.PHONY: lint
