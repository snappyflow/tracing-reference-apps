package main

import (
	"net/http"
)

// GetContext gets the current request context for log
func GetContext(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		ctxLabel.curCtx = r.Context()
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

// GetContextLogrus gets the current request context for logrus
func GetContextLogrus(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		logrusCtxLabel.UpdateCtxLabels(r.Context())
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}
