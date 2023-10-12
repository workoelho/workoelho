package web

import (
	"log"
	"net/http"
	"runtime/debug"
)

// Recover recovers from panics and returns a 500 status code.
func Recover() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil && err != http.ErrAbortHandler {
					log.Printf("panic: %v %s\n", err, debug.Stack())
					w.WriteHeader(http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
