// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package database

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var database Database

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

// Open creates a new connection pool to the database.
func Open() {
	var err error

	database, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}

	// Use PostgreSQL placeholders `$1` instead of MySQL `?`.
	squirrel.StatementBuilder = squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
}

// Set resets the pool to the database.
// Useful for mocking.
func Set(d Database) {
	database = d
}

// Close closes all connections to the database.
func Close() {
	database.Close()
}

// Begin starts a transaction.
func Begin(ctx context.Context) (pgx.Tx, error) {
	return database.Begin(ctx)
}

// Query executes a query that returns rows.
func Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error) {
	return database.Query(ctx, sql, args...)
}

// QueryRow executes a query that is expected to return at most one row.
func QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row {
	return database.QueryRow(ctx, sql, args...)
}
