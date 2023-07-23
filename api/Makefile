CGO_ENABLED=0
GOOS=linux

workoelho: lint test
	@go build -a -ldflags '-extldflags "-static"' -o workoelho .

start: workoelho
	@./workoelho

watch:
	@air

test: lint
	@go test ./...

lint: main.go
	@go fmt ./...
	@go vet ./...
	@go fix ./...

.PHONY: lint test
