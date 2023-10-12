// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"net/http"
	"os"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/workoelho/workoelho/handlers"
	"github.com/workoelho/workoelho/web"
)

func main() {
	// Use PostgreSQL placeholders `$1` instead of MySQL `?`.
	squirrel.StatementBuilder = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	// Pool of database connections.
	// TODO: Read connection string from flag instead of environment variable.
	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	defer pool.Close()

	v1 := http.NewServeMux()
	v1.Handle("/users/", http.StripPrefix("/users", handlers.Users(pool))

	mux := http.NewServeMux()
	mux.Handle("/v1/", http.StripPrefix("/v1", v1))

	w := web.New()

	w.Use(web.Recover())
	w.Use(web.RemoteAddr())
	w.Use(web.RequestId())
	w.Use(web.Logger())
	w.Use(web.Muxer(mux))

	w.Listen(":1234")
}
