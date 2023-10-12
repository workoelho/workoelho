package web

import (
	"net/http"

	"github.com/google/uuid"
)

const HeaderRequestId = "X-Request-Id"

// RequestId ensures responses have a request identification header.
func RequestId() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := r.Header.Get(HeaderRequestId)
			if id == "" {
				id = uuid.New().String()
			}
			w.Header().Set(HeaderRequestId, id)
			next.ServeHTTP(w, r)
		})
	}
}
