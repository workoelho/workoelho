package web

import (
	"log"
	"net/http"
	"time"
)

// BufferedResponseWriter is like a http.ResponseWriter but it buffers the response and status code until it's manually flushed.
type bufferedResponseWriter struct {
	http.ResponseWriter
	status int
	buffer []byte
}

// WriteHeader writes the status code to the buffer.
func (w *bufferedResponseWriter) WriteHeader(status int) {
	w.status = status
}

// Write writes to the buffer.
func (w *bufferedResponseWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = 200
	}
	w.buffer = append(w.buffer, b...)
	return len(b), nil
}

// Flush flushes the status code and buffer to the response.
func (w *bufferedResponseWriter) Flush() error {
	if w.status == 0 {
		w.status = 200
	}
	w.ResponseWriter.WriteHeader(w.status)
	_, err := w.ResponseWriter.Write(w.buffer)
	return err
}

// LoggingHandler buffers response and logs request details.
func LoggingHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			b := &bufferedResponseWriter{w, 0, []byte{}}
			t := time.Now()

			next.ServeHTTP(b, r)

			b.Flush()

			log.Println(w.Header().Get(RequestIDHeader), r.RemoteAddr, r.Method, r.URL.Path, r.Form.Encode(), b.status, len(b.buffer), time.Since(t))
		})
	}
}
