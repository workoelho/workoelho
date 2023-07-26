package main

import (
	"context"
	"fmt"
	"log"
	"net/mail"
	"os"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

// Database can execute queries.
type Database interface {
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, args ...interface{}) (pgconn.CommandTag, error)
}

// Database primary and foreign key type.
type Id int

// ValidationError describes a validation error on a JSON field.
type ValidationError struct {
	Field  string                 `json:"field"`
	Rule   string                 `json:"rule"`
	Detail map[string]interface{} `json:"detail,omitempty"`
}

// Error returns the validation error as a string.
func (v *ValidationError) Error() error {
	return fmt.Errorf("%v", v)
}

// ValidationErrors is a list of validation errors.
type ValidationErrors []ValidationError

// Validation rules.
const (
	RuleRequired = "required"
	RuleFormat   = "format"
	RuleUnique   = "unique"
	RuleLength   = "length"
)

// Append appens a new validation error to the list.
func (v *ValidationErrors) Append(field, rule string, detail map[string]interface{}) {
	*v = append(*v, ValidationError{
		Field:  field,
		Rule:   rule,
		Detail: detail,
	})
}

// Table names of the database schema.
const (
	TableUsers = "users"
)

// User holds credentials and controls which people has access to which companies.
type User struct {
	Id             Id         `json:"id" db:"id"`
	CreatedAt      *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt      *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedAt      *time.Time `json:"deletedAt" db:"deleted_at"`
	Status         string     `json:"status" db:"status"`
	Email          string     `json:"email" db:"email"`
	Password       string     `json:"password,omitempty" db:"-"`
	PasswordDigest string     `json:"-" db:"password_digest"`
	CompanyId      *Id        `json:"companyId" db:"company_id"`
	PersonId       *Id        `json:"personId" db:"person_id"`
}

// UserStatus indicates the status of a user.
const (
	UserStatusUnconfirmed = "unconfirmed"
	UserStatusActive      = "active"
	UserStatusBlocked     = "blocked"
)

// CreatePassword digests given password and assigns it to the user.
func (u *User) CreatePassword() error {
	h, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordDigest = string(h)
	u.Password = ""
	return nil
}

// ComparePassword compares incoming password with the existing digest.
func (u *User) ComparePassword(pwd string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordDigest), []byte(pwd))
}

// Validate user data.
func (u *User) Validate(db Database) ([]ValidationError, error) {
	ve := ValidationErrors{}

	if u.Status == "" {
		ve.Append("status", RuleRequired, nil)
	}

	if u.Email == "" {
		ve.Append("email", RuleRequired, nil)
	} else if _, err := mail.ParseAddress(u.Email); err != nil {
		ve.Append("email", RuleFormat, map[string]interface{}{"format": "email"})
	} else {
		qb := squirrel.Select("1").From(TableUsers).
			Where(squirrel.Eq{"email": u.Email}).Limit(1)

		if u.Id != 0 {
			qb = qb.Where(squirrel.NotEq{"id": u.Id})
		}

		q, args, err := qb.ToSql()

		if err != nil {
			return nil, err
		}

		if r, err := db.Query(context.Background(), q, args...); err != nil {
			return nil, err
		} else if r.Next() {
			ve.Append("email", RuleUnique, nil)
		}
	}

	minimum := 12

	if u.PasswordDigest == "" {
		if u.Password == "" {
			ve.Append("password", RuleRequired, nil)
		} else if len(u.Password) < minimum {
			ve.Append("password", RuleLength, map[string]interface{}{"minimum": minimum})
		}
	}

	return ve, nil
}

// Create ...
func (u *User) Create(db Database) error {
	if u.Password != "" {
		if err := u.CreatePassword(); err != nil {
			return err
		}
	}

	q, args, err := squirrel.
		Insert(TableUsers).Columns("status", "email", "password_digest").
		Values(u.Status, u.Email, u.PasswordDigest).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	r, err := db.Query(context.Background(), q, args...)

	if err != nil {
		return err
	}

	*u, err = pgx.CollectOneRow(r, pgx.RowToStructByNameLax[User])

	if err != nil {
		return err
	}

	return nil
}

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
		u := &User{
			Status: UserStatusUnconfirmed,
		}

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
