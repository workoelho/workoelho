package web

import "net/http"

// Muxer is a middleware that wraps a http.ServeMux.
func Muxer(mux *http.ServeMux) Middleware {
	return func(next http.Handler) http.Handler {
		mux.Handle("/", next)

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			mux.ServeHTTP(w, r)
		})
	}
}
