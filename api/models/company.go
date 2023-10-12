// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/sanitization"
)

// Company ...
type Company struct {
	database.Record

	// Name of the company.
	Name string `input:"name" output:"name" db:"name"`
}

// New resets all fields to their default values.
func (c *Company) New() {
	c.Record.New()
	c.Name = ""
}

// Table name on the database.
func (*Company) Table() string {
	return "companies"
}

// Sanitize values after user input.
func (c *Company) Sanitize() error {
	c.Name = sanitization.Condense(c.Name)
	return nil
}

// Validate ensures the struct is in a valid state.
func (c *Company) Validate(ctx context.Context, database database.DB) error {
	return nil
}

// Writable checks if the session can write to the model.
func (c *Company) Writable(ctx context.Context, database database.DB, session *Session) error {
	return nil
}

// Create inserts a new record into the database.
func (c *Company) Create(ctx context.Context, tx pgx.Tx) error {
	q, args, err := squirrel.Insert(c.Table()).
		Columns("name").
		Values(c.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := tx.Query(context.Background(), q, args...)
	if err != nil {
		return err
	}
	defer rows.Close()

	*c, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[Company])

	if err != nil {
		return err
	}

	return nil
}
