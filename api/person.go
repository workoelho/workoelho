// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
)

// Person model.
type Person struct {
	database.Record

	// Person's name.
	Name string `input:"name" output:"name" sanitize:"trim,squeeze" db:"name"`
}

// Table returns the table name.
func (*Person) Table() string {
	return "people"
}

// New assigns default values.
func (p *Person) New() {
	p.CreatedAt = time.Now()
	p.UpdatedAt = p.CreatedAt
}

// Sanitize sanitizes the struct values after user input.
func (p *Person) Sanitize() error {
	return nil
}

// Validate ensures the struct is in a valid state.
func (p *Person) Validate() error {
	return nil
}

// Writable checks if the session can write to the model.
func (p *Person) Writable(s *Session) error {
	return nil
}

// Create saves data to the database.
func (p *Person) Create() error {
	q, args, err := squirrel.
		Insert(p.Table()).Columns("name").
		Values(p.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := database.Query(context.Background(), q, args...)
	if err != nil {
		return err
	}
	defer rows.Close()

	*p, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[Person])

	if err != nil {
		return err
	}

	return nil
}
