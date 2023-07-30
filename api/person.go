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
	RelationPeople = "people"
)

// Person model.
type Person struct {
	// Id of the record.
	Id Id `json:"id" db:"id"`
	// Date and time when the record was created.
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	// Date and time when the record was last updated.
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	// Date and time when the record was deleted.
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	// Person's name.
	Name string `json:"name" db:"name"`
}

// NewPerson returns a new instance with default values.
func NewPerson() *Person {
	return &Person{}
}

// Create saves data to the database.
func (p *Person) Create(db Database) error {
	q, args, err := squirrel.
		Insert(RelationPeople).Columns("name").
		Values(p.Name).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	r, err := db.Query(context.Background(), q, args...)

	if err != nil {
		return err
	}

	*p, err = pgx.CollectOneRow(r, pgx.RowToStructByNameLax[Person])

	if err != nil {
		return err
	}

	return nil
}
