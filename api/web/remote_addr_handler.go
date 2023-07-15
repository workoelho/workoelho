package web

import (
	"net/http"
	"regexp"
	"strings"
)

var (
	forwardedExpr = regexp.MustCompile(`(?i)(?:for=)([^(;|,| )]+)`)
)

// RemoteAddrHandler digs up the remote client address.
//
// References:
// 1. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For.
// 2. https://stackoverflow.com/questions/72557636/difference-between-x-forwarded-for-and-x-real-ip-headers.
// 3. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded.
func RemoteAddrHandler() Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if value := r.Header.Get("X-Forwarded-For"); value != "" {
				i := strings.Index(value, ", ")
				if i == -1 {
					i = len(value)
				}
				r.RemoteAddr = value[:i]
			} else if value := r.Header.Get("X-Real-IP"); value != "" {
				r.RemoteAddr = value
			} else if value := r.Header.Get("Forwarded"); value != "" {
				if match := forwardedExpr.FindStringSubmatch(value); len(match) > 1 {
					r.RemoteAddr = strings.Trim(match[1], `"`)
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
