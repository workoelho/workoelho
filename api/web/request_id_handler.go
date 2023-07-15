package web

import (
	"net/http"

	"github.com/google/uuid"
)

// RequestIDHeader holds the header name for the request ID.
const RequestIDHeader = "X-Request-Id"

// RequestIDHandler handles request identification.
func RequestIDHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := r.Header.Get(RequestIDHeader)
			if id == "" {
				id = uuid.New().String()
			}
			w.Header().Set(RequestIDHeader, id)
			next.ServeHTTP(w, r)
		})
	}
}
