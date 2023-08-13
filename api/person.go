// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/sanitization"
	"github.com/workoelho/workoelho/validation"
)

// Person model.
type Person struct {
	database.Record

	// Person's name.
	Name string `input:"name" output:"name" db:"name"`
}

// NewPerson returns an instance with default values.
func NewPerson() *Person {
	p := &Person{}
	p.CreatedAt = time.Now()
	p.UpdatedAt = p.CreatedAt
	return p
}

// Table returns the table name.
func (*Person) Table() string {
	return "people"
}

// Sanitize values after user input.
func (p *Person) Sanitize() error {
	p.Name = sanitization.Condense(p.Name)
	return nil
}

// Validate ensures the struct is in a valid state.
func (p *Person) Validate(req Request) error {
	v := validation.New()

	if err := validation.Empty(p.Name); err != nil {
		v.Append(Tag(p, "Name", "output"), err)
	}

	return v
}

// Writable checks if the session can write to the model.
func (p *Person) Writable(req Request) error {
	return nil
}

// Create saves data to the database.
func (p *Person) Create(req Request) error {
	q, args, err := squirrel.Insert(p.Table()).
		Columns("name").
		Values(p.Name).
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

	*p, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[Person])

	if err != nil {
		return err
	}

	return nil
}
