// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/validation"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	jsoniter "github.com/json-iterator/go"
)

func main() {
	database.Open()
	defer database.Close()

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
		err := c.Next()

		if tx, ok := c.Locals("tx").(pgx.Tx); ok {
			if err == nil {
				tx.Commit(c.Context())
			} else {
				tx.Rollback(c.Context())
			}
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
		user := &User{}
		user.New()

		if err := c.BodyParser(user); err != nil {
			return err
		}

		if err := user.Sanitize(); err != nil {
			return err
		}

		if err := user.Writable(c); err != nil {
			return fiber.ErrUnauthorized
		}

		if user.CompanyId == "" {
			user.Company = &Company{}
			user.Company.New()
			if err := user.Company.Create(); err != nil {
				return err
			}
			user.CompanyId = user.Company.Id
		}

		if user.PersonId == "" {
			user.Person = &Person{}
			user.Person.New()
			if err := user.Person.Create(); err != nil {
				return err
			}
			user.PersonId = user.Person.Id
		}

		if err := user.Validate(); err != nil {
			if err, ok := err.(validation.Validation); ok {
				return c.Status(fiber.StatusUnprocessableEntity).JSON(err)
			}
		}

		if err := user.DigestPassword(); err != nil {
			return err
		}

		if err := user.Create(); err != nil {
			return err
		}

		return c.Status(fiber.StatusCreated).JSON(user)
	})

	if err := f.Listen(":1234"); err != nil {
		log.Fatal(err)
	}
}
