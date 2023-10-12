package web

import (
	"net/http"
	"path"
)

// Route ...
type Route struct {
	Method string
	Prefix string
	Name   string
}

// Parse ...
func (r *Route) Parse(req *http.Request) {
	r.Method = req.Method
	r.Prefix, r.Name = path.Split(req.URL.Path)
}

// Match ...
func (r *Route) Match(method string, pattern string) bool {
	if method != r.Method {
		return false
	}
	matched, err := path.Match(pattern, r.Prefix+r.Name)
	if err != nil {
		panic(err)
	}
	return matched
}
