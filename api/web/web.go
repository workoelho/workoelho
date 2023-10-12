package web

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Middleware is an http.Handler decorator.
type Middleware func(http.Handler) http.Handler

// Web holds the middleware chain.
type Web struct {
	middlewares []Middleware
}

// New returns a new *Web.
func New() *Web {
	return &Web{
		middlewares: []Middleware{},
	}
}

// Use appends a middleware to the middleware chain.
func (w *Web) Use(mw Middleware) {
	w.middlewares = append(w.middlewares, mw)
}

// Handler resolves the middleware chain into a final http.Handler.
func (w *Web) Handler() http.Handler {
	var handler http.Handler
	handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	})

	for i := len(w.middlewares) - 1; i >= 0; i-- {
		handler = w.middlewares[i](handler)
	}
	return handler
}

// Listen creates a new http.Server and starts listening for requests.
func (w *Web) Listen(addr string) {
	srv := &http.Server{
		Addr:         ":1234",
		Handler:      w.Handler(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  30 * time.Second,
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Println("Ready")

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error: %v\n", err)
		}
	}()

	<-stop
	log.Println("Stopping...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Error: %v\n", err)
	}
}
