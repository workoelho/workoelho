// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
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

// NewCompany returns an instance with default values.
func NewCompany() *Company {
	c := &Company{}
	c.CreatedAt = time.Now()
	c.UpdatedAt = c.CreatedAt
	return c
}

// Table returns the table name.
func (*Company) Table() string {
	return "companies"
}

// Sanitize values after user input.
func (c *Company) Sanitize() error {
	c.Name = sanitization.Condense(c.Name)
	return nil
}

// Validate ensures the struct is in a valid state.
func (c *Company) Validate() error {
	return nil
}

// Writable checks if the session can write to the model.
func (c *Company) Writable(req Request) error {
	return nil
}

// Create inserts the struct values into the database.
func (c *Company) Create(req Request) error {
	q, args, err := squirrel.Insert(c.Table()).
		Columns("name").
		Values(c.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	tx, err := req.Tx()
	if err != nil {
		return err
	}

	rows, err := tx.Query(req.Context(), q, args...)
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
