package web

import (
	"log"
	"net/http"
	"time"
)

// bufferedResponseWriter wraps http.ResponseWriter and buffers writes before flushing.
type bufferedResponseWriter struct {
	http.ResponseWriter
	status int
	body   []byte
}

// WriteHeader saves the status code to be flushed later.
func (w *bufferedResponseWriter) WriteHeader(status int) {
	w.status = status
}

// Write saves the body to be flushed later.
func (w *bufferedResponseWriter) Write(b []byte) (int, error) {
	w.body = append(w.body, b...)
	return len(b), nil
}

// Flush writes the status code and body to the actual ResponseWriter.
func (w *bufferedResponseWriter) Flush() error {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	w.ResponseWriter.WriteHeader(w.status)
	_, err := w.ResponseWriter.Write(w.body)
	return err
}

// Logger logs request and response information.
func Logger() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			b := &bufferedResponseWriter{ResponseWriter: w}
			t := time.Now()

			next.ServeHTTP(b, r)

			b.Flush()

			log.Println(w.Header().Get(HeaderRequestId), r.RemoteAddr, r.Method, r.URL.Path, r.Form.Encode(), b.status, len(b.body), time.Since(t))
		})
	}
}
