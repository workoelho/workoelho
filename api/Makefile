CGO_ENABLED=0
GOOS=linux

build: lint test
	go build

run: build
	./workoelho

test: lint
	go test ./...

lint: main.go
	go fmt ./...
	go vet ./...
	go fix ./...

.PHONY: lint test
