// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"log"
	"os"
	"reflect"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/workoelho/workoelho/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	jsoniter "github.com/json-iterator/go"
)

// Tag returns the value of a field tag on the given struct.
func Tag(s interface{}, field string, tag string) string {
	f, ok := reflect.TypeOf(s).Elem().FieldByName(field)
	if !ok {
		panic("field not found")
	}
	return f.Tag.Get(tag)
}

type ctx struct {
	*fiber.Ctx
}

// Ctx wraps and extend fiber.Context.
func Ctx(c *fiber.Ctx) *ctx {
	return &ctx{c}
}

// Request has methods to access request bound details like the session or the database connection.
type Request interface {
	Session() *Session
	Db() database.Database
	Tx() (pgx.Tx, error)
	Context() context.Context
}

// Session gets the session bound to the request.
func (c *ctx) Session() *Session {
	s := c.Locals("session")
	if s == nil {
		return nil
	}
	return s.(*Session)
}

// Db gets the database connection bound to the request.
func (c *ctx) Db() database.Database {
	return c.Locals("db").(database.Database)
}

// Tx gets the existing or begins a transaction and bind it to the request.
// Tx panics if the transaction cannot be initiated.
func (c *ctx) Tx() (pgx.Tx, error) {
	tx := c.Locals("tx")

	if tx != nil {
		return tx.(pgx.Tx), nil
	}

	if tx, err := c.Db().Begin(c.Context()); err != nil {
		return nil, err
	} else {
		c.Locals("tx", tx)
		return tx, nil
	}
}

// Context gets the context bound to the request.
func (c *ctx) Context() context.Context {
	return c.Ctx.Context()
}

func main() {
	// Use PostgreSQL placeholders `$1` instead of MySQL `?`.
	squirrel.StatementBuilder = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	// Pool database connections.
	// TODO: Read connection string from flag instead of environment variable.
	db, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	f := fiber.New(fiber.Config{
		// Prefork has better performance in production.
		Prefork: false,

		// Support for different tags when marshaling and unmarshaling JSON.
		// This way we can control which fields are read from a request and which are written into a response separately.
		JSONEncoder: jsoniter.Config{TagKey: "output", OnlyTaggedField: true}.Froze().Marshal,
		JSONDecoder: jsoniter.Config{TagKey: "input", OnlyTaggedField: true}.Froze().Unmarshal,
	})

	f.Use(logger.New())
	f.Use(recover.New())
	f.Use(requestid.New())

	f.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)

		err := c.Next()

		// Make sure we either commit or rollback any existing transaction after each request.
		if tx := c.Locals("tx"); tx != nil {
			tx := tx.(pgx.Tx)

			if err == nil {
				tx.Commit(c.Context())
			}
			defer tx.Rollback(c.Context())
		}

		return err
	})

	v1 := f.Group("/v1")

	// v1.Post("/sessions", func(c *fiber.Ctx) error {
	// 	session := &Session{}
	// 	session.New()

	// 	credentials := &Credentials{}

	// 	if err := c.BodyParser(credentials); err != nil {
	// 		return err
	// 	}

	// 	if err := credentials.Sanitize(); err != nil {
	// 		return err
	// 	}

	// 	if err := credentials.Validate(); err != nil {
	// 		if err, ok := err.(validation.Validation); ok {
	// 			return c.Status(fiber.StatusUnprocessableEntity).JSON(err)
	// 		}
	// 	}

	// 	if err := session.Create(c); err != nil {
	// 		return err
	// 	}

	// 	return c.Status(fiber.StatusCreated).JSON(session)
	// })

	// v1.Get("/sessions/:id", func(c *fiber.Ctx) error {
	// })

	v1.Post("/users", func(c *fiber.Ctx) error {
		user := NewUser()

		if err := c.BodyParser(user); err != nil {
			return err
		}

		if err := user.Sanitize(); err != nil {
			return err
		}

		if err := user.Writable(Ctx(c)); err != nil {
			return fiber.ErrUnauthorized
		}

		if user.CompanyId == "" {
			user.Company = NewCompany()
			// if err := user.Company.Create(Ctx(c)); err != nil {
			// 	return err
			// }
			// user.CompanyId = user.Company.Id
		}

		if user.PersonId == "" {
			user.Person = NewPerson()
			// if err := user.Person.Create(Ctx(c)); err != nil {
			// 	return err
			// }
			// user.PersonId = user.Person.Id
		}

		// if err := user.Validate(Ctx(c)); err != nil {
		// 	if err, ok := err.(validation.Validation); ok {
		// 		return c.Status(fiber.StatusUnprocessableEntity).JSON(err)
		// 	}
		// }

		if err := user.DigestPassword(); err != nil {
			return err
		}

		// if err := user.Create(Ctx(c)); err != nil {
		// 	return err
		// }

		tx, err := db.Begin(c.Context())
		if err != nil {
			return err
		}
		defer tx.Rollback(c.Context())

		if _, err := tx.Exec(c.Context(), `INSERT INTO people (name) VALUES ('')`); err != nil {
			return err
		}

		if err := tx.Commit(c.Context()); err != nil {
			return err
		}

		return c.Status(fiber.StatusCreated).JSON(user)
	})

	if err := f.Listen(":1234"); err != nil {
		log.Fatal(err)
	}
}
