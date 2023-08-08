// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package database

import (
	"context"
	"os"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Database interface can execute statements, query rows and begin transactions.
type Database interface {
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, args ...interface{}) (pgconn.CommandTag, error)
	Begin(ctx context.Context) (pgx.Tx, error)
	Close()
}

// Primary and foreign key type.
type Id string

// Record holds basic fields every database record should have.
type Record struct {
	// Id of the record.
	Id Id `output:"id" db:"id"`
	// Date and time when the record was created.
	CreatedAt time.Time `output:"createdAt" db:"created_at"`
	// Date and time when the record was last updated.
	UpdatedAt time.Time `output:"updatedAt" db:"updated_at"`
	// Date and time when the record was deleted.
	DeletedAt *time.Time `output:"deletedAt" db:"deleted_at"`
}

var database Database

// Open ...
func Open() error {
	// Use PostgreSQL placeholders `$1` instead of MySQL `?`.
	squirrel.StatementBuilder = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	var err error
	database, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	return err
}

// Close ...
func Close() {
	database.Close()
}

// Get ...
func Get() Database {
	return database
}

// Set changes the database instance. Useful for mocking.
func Set(d Database) {
	database = d
}

// Tx returns a transaction bound to a request context.
func Tx(c *fiber.Ctx) pgx.Tx {
	tx := c.Locals("tx").(pgx.Tx)
	if tx == nil {
		tx, err := database.Begin(c.Context())
		if err != nil {
			panic(err)
		}
		c.Locals("tx", tx)
	}
	return tx
}

// Query executes a query that returns rows.
func Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error) {
	return database.Query(ctx, sql, args...)
}

// QueryRow executes a query that is expected to return at most one row.
func QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row {
	return database.QueryRow(ctx, sql, args...)
}
