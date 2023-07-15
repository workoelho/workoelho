package web

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

// Middleware is a function that gets the next handler and returns a new handler.
type Middleware func(http.Handler) http.Handler

// Web holds configuration for the server.
type Web struct {
	middlewares []Middleware
}

// Use adds a middleware to the stack.
func (w *Web) Use(mw Middleware) {
	w.middlewares = append(w.middlewares, mw)
}

// New returns a new Web instance.
func New() *Web {
	return &Web{
		middlewares: []Middleware{},
	}
}

// Listen starts the HTTP server.
func (w *Web) Listen(addr string) {
	handler := http.NotFoundHandler()
	for i := len(w.middlewares) - 1; i >= 0; i-- {
		handler = w.middlewares[i](handler)
	}

	srv := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  30 * time.Second,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	go func() {
		log.Printf("⚡ Listening on http://%s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("🚫 Failed to listen on %s: %v\n", addr, err)
		}
	}()

	<-quit
	log.Println("⚡ Stopping…")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	srv.SetKeepAlivesEnabled(false)
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("🚫 Quit failed: %v\n", err)
	}
}
