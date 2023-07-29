// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"log"
	"os"

	"github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	db, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	squirrel.StatementBuilder = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	f := fiber.New()

	f.Use(logger.New())
	f.Use(recover.New())
	f.Use(requestid.New())

	v1 := f.Group("/v1")

	v1.Post("/users", func(c *fiber.Ctx) error {
		u := NewUser()

		if err := c.BodyParser(u); err != nil {
			return err
		}

		if ve, err := u.Validate(db); err != nil {
			return err
		} else if len(ve) > 0 {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(ve)
		}

		if err := pgx.BeginFunc(c.Context(), db, func(tx pgx.Tx) error {
			return u.Create(tx)
		}); err != nil {
			return err
		}

		return c.Status(fiber.StatusCreated).JSON(u)
	})

	f.Listen(":1234")
}
