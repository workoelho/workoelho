// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package database

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// DB interface can execute statements, query rows and begin transactions.
type DB interface {
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, args ...interface{}) (pgconn.CommandTag, error)
	Begin(ctx context.Context) (pgx.Tx, error)
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

// New resets all fields to their default values.
func (r *Record) New() {
	r.Id = ""
	r.CreatedAt = time.Now()
	r.UpdatedAt = r.CreatedAt
	r.DeletedAt = nil
}
