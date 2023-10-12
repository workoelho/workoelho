// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"

	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/sanitization"
	"github.com/workoelho/workoelho/validation"
)

// Credentials ...
type Credentials struct {
	// Email.
	Email string `input:"email" output:"email" db:"email"`
	// Password in plain text.
	Password string `input:"password,omitempty" db:"-"`
}

// Sanitize values after user input.
func (c *Credentials) Sanitize() error {
	c.Email = sanitization.Lower(sanitization.Trim(c.Email))
	return nil
}

// Validate ensures the struct is in a valid state.
func (c *Credentials) Validate(ctx context.Context, database database.DB) error {
	v := validation.New()

	if err := validation.Empty(c.Email); err != nil {
		v.Append("email", err)
	} else if err := validation.Format(c.Email, "email"); err != nil {
		v.Append("email", err)
	}

	if c.Password != "" {
		if err := validation.Length(c.Password, 16, 512); err != nil {
			v.Append("password", err)
		}
	}

	if !v.Empty() {
		return v
	}
	return nil
}
