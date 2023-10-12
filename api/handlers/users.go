// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/models"
	"github.com/workoelho/workoelho/validation"
)

func Users(db database.DB) http.Handler {
	route := &Route{}




	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		route.Parse(r)

		switch {
		case route.Match(http.MethodPost, "/"):
		session := &models.Session{}
		session.New()

		user := &models.User{}
		user.New()

		if err := json.NewDecoder(r.Body).Decode(user); err != nil {
			http.Error(w, "", http.StatusBadRequest)
			panic(err)
		}

		if err := user.Sanitize(); err != nil {
			panic(err)
		}

		if err := user.Writable(r.Context(), db, session); err != nil {
			http.Error(w, "", http.StatusUnauthorized)
			panic(err)
		}

		if err := user.Validate(r.Context(), db); err != nil {
			if err, ok := err.(validation.Validation); ok {
				http.Error(w, "", http.StatusUnprocessableEntity)
				panic(err)
			}
		}

		if err := user.DigestPassword(); err != nil {
			panic(err)
		}

		tx, err := db.Begin(r.Context())
		if err != nil {
			panic(err)
		}
		defer tx.Rollback(r.Context())

		if err := user.Create(r.Context(), tx); err != nil {
			panic(err)
		}

		if err := tx.Commit(r.Context()); err != nil {
			panic(err)
		}
	})
}
