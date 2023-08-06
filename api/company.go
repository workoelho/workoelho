// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"time"

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

// Table returns the table name.
func (*Company) Table() string {
	return "companies"
}

// New assigns default values.
func (c *Company) New() {
	c.CreatedAt = time.Now()
	c.UpdatedAt = c.CreatedAt
}

// Sanitize sanitizes values after user input.
func (c *Company) Sanitize() error {
	c.Name = sanitization.Condense(c.Name)
	return nil
}

// Validate ensures the struct is in a valid state.
func (c *Company) Validate() error {
	return nil
}

// Writable checks if the session can write to the model.
func (c *Company) Writable(s *Session) error {
	return nil
}

// Create inserts the struct values into the database.
func (c *Company) Create() error {
	q, args, err := squirrel.Insert(c.Table()).
		Columns("name").Values(c.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := database.Query(context.Background(), q, args...)
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
