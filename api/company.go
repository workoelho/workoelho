// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
)

// Database relation name.
const (
	RelationCompanies = "companies"
)

// Company ...
type Company struct {
	// Id of the record.
	Id Id `json:"id" db:"id"`
	// Date and time when the record was created.
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	// Date and time when the record was last updated.
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	// Date and time when the record was deleted.
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	// Name of the company.
	Name string `json:"name" db:"name"`
}

// NewCompany returns a new instance with default values.
func NewCompany() *Company {
	return &Company{}
}

// Create saves data to the database.
func (c *Company) Create(db Database) error {
	q, args, err := squirrel.
		Insert(RelationCompanies).Columns("name").
		Values(c.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	r, err := db.Query(context.Background(), q, args...)

	if err != nil {
		return err
	}

	*c, err = pgx.CollectOneRow(r, pgx.RowToStructByNameLax[Company])

	if err != nil {
		return err
	}

	return nil
}
