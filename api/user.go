// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"errors"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
	"github.com/workoelho/workoelho/sanitization"
	"github.com/workoelho/workoelho/validation"
	"golang.org/x/crypto/bcrypt"
)

// UserStatuses is a slice of all available user statuses.
var UserStatuses []string = []string{
	"unconfirmed",
	"active",
	"blocked",
}

// User holds credentials and links which people has access to which companies.
type User struct {
	database.Record

	Status string `output:"status" db:"status"`
	// User's email.
	Email string `input:"email" output:"email" db:"email"`
	// Password in plain text. Used as an intermediate field before digesting.
	Password string `input:"password,omitempty" db:"-"`
	// Password digested.
	PasswordDigest string `db:"password_digest"`
	// Id of the company the user belongs to.
	CompanyId database.Id `input:"companyId" output:"companyId" db:"company_id"`
	// Company model.
	Company *Company `output:"company,omitempty" db:"-"`
	// Id of the person behind the user.
	PersonId database.Id `input:"personId" output:"personId" db:"person_id"`
	// Person model.
	Person *Person `output:"person,omitempty" db:"-"`
}

// Table returns the table name for the model.
func (*User) Table() string {
	return "users"
}

// DigestPassword digests assigned password. Does nothing if the password is empty.
func (u *User) DigestPassword() error {
	if u.Password == "" {
		return nil
	}
	h, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordDigest = string(h)
	u.Password = ""
	return nil
}

// ComparePassword compares incoming password with the existing digest.
func (u *User) ComparePassword(pwd string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordDigest), []byte(pwd))
}

// New assigns default values.
func (u *User) New() {
	u.CreatedAt = time.Now()
	u.UpdatedAt = u.CreatedAt
	u.Status = "unconfirmed"
	u.Company = &Company{}
	u.Company.New()
	u.Person = &Person{}
	u.Person.New()
}

// Sanitize sanitizes the struct values after user input.
func (u *User) Sanitize() error {
	return sanitization.Struct(u)
}

// Validate ensures the struct is in a valid state.
func (u *User) Validate() error {
	v := validation.New()

	if err := validation.Empty(u.Status); err != nil {
		v.Append("status", err)
	} else if err := validation.Unknown(u.Status, UserStatuses); err != nil {
		v.Append("status", err)
	}

	if err := validation.Empty(u.Email); err != nil {
		v.Append("email", err)
	} else if err := validation.Format(u.Email, "email"); err != nil {
		v.Append("email", err)
	} else {
		taken, err := u.Exists(func(q squirrel.SelectBuilder) squirrel.SelectBuilder {
			q = q.Where(squirrel.Eq{"email": u.Email})
			if u.Id != "" {
				q = q.Where(squirrel.NotEq{"id": u.Id})
			}
			return q
		})

		if err != nil {
			return err
		}

		if taken {
			v.Append("email", &validation.Error{Field: "", Issue: "taken", Detail: nil})
		}
	}

	if u.PasswordDigest == "" {
		if err := validation.Empty(u.Password); err != nil {
			v.Append("password", err)
		}
	}

	if u.Password != "" {
		if err := validation.Length(u.Password, 16, 512); err != nil {
			v.Append("password", err)
		}
	}

	if err := validation.Empty(u.CompanyId); err != nil {
		v.Append("companyId", err)
	}

	if err := validation.Empty(u.PersonId); err != nil {
		v.Append("personId", err)
	}

	if !v.Empty() {
		return v
	}
	return nil
}

// Writable checks if the session can write to the model.
func (u *User) Writable(s *Session) error {
	if u.CompanyId != "" && s.User != nil && u.CompanyId != s.User.CompanyId {
		return errors.New("cannot write to a different company")
	}
	return nil
}

// Create inserts the struct values into the database.
func (u *User) Create() error {
	q, args, err := squirrel.Insert(u.Table()).
		Columns("status", "email", "password_digest", "company_id", "person_id").
		Values(u.Status, u.Email, u.PasswordDigest, u.CompanyId, u.PersonId).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := database.Query(context.Background(), q, args...)
	if err != nil {
		return err
	}
	defer rows.Close()

	*u, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[User])

	if err != nil {
		return err
	}

	return nil
}

// Exists checks if at least one record matching the given criteria exists.
func (u *User) Exists(build func(squirrel.SelectBuilder) squirrel.SelectBuilder) (bool, error) {
	qb := build(squirrel.Select("1").From(u.Table()).Limit(1))

	q, args, err := qb.ToSql()

	if err != nil {
		return false, err
	}

	rows, err := database.Query(context.Background(), q, args...)
	if err != nil {
		return false, err
	}
	rows.Close()

	return rows.Next(), nil
}
