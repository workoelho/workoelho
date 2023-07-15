package web

import (
	"net/http"
	"time"

	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
)

// RateLimiterHandler limits the number of requests from a single client.
func RateLimiterHandler() Middleware {
	limiter := tollbooth.NewLimiter(10, &limiter.ExpirableOptions{DefaultExpirationTTL: time.Hour})

	limiter.SetMessage("")
	limiter.SetMessageContentType("application/json; charset=utf-8")

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			err := tollbooth.LimitByRequest(limiter, w, r)
			if err != nil {
				w.Header().Add("Content-Type", limiter.GetMessageContentType())
				w.WriteHeader(err.StatusCode)
				w.Write([]byte(err.Message))
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
