// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/helpers"
	"github.com/workoelho/workoelho/sanitization"
	"github.com/workoelho/workoelho/validation"
)

// Person model.
type Person struct {
	database.Record

	// Person's name.
	Name string `input:"name" output:"name" db:"name"`
}

// New resets all fields to their default values.
func (p *Person) New() {
	p.Record.New()
	p.Name = ""
}

// Table name on the database.
func (*Person) Table() string {
	return "people"
}

// Sanitize values after user input.
func (p *Person) Sanitize() error {
	p.Name = sanitization.Condense(p.Name)
	return nil
}

// Validate ensures the struct is in a valid state.
func (p *Person) Validate(ctx context.Context, database database.DB) error {
	v := validation.New()

	if err := validation.Empty(p.Name); err != nil {
		v.Append(helpers.Tag(p, "Name", "output"), err)
	}

	return v
}

// Writable checks if the session can write to the model.
func (p *Person) Writable(ctx context.Context, session *Session) error {
	return nil
}

// Create inserts a new record into the database.
func (p *Person) Create(ctx context.Context, tx pgx.Tx) error {
	q, args, err := squirrel.Insert(p.Table()).
		Columns("name").
		Values(p.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := tx.Query(context.Background(), q, args...)
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
