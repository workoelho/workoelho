// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/validation"
	"golang.org/x/crypto/bcrypt"
)

// Database relation names.
const (
	RelationUsers = "users"
)

// UserStatuses is a slice of all available user statuses.
var UserStatuses []string = []string{
	"unconfirmed",
	"active",
	"blocked",
}

// User holds credentials and controls which people has access to which companies.
type User struct {
	// Id of the record.
	Id Id `json:"id" db:"id"`
	// Date and time when the record was created.
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	// Date and time when the record was last updated.
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	// Date and time when the record was deleted.
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	// Whether the user is active, needs confirmation, etc.
	Status string `json:"status" db:"status"`
	// User's email.
	Email string `json:"email" db:"email"`
	// Password in plain text. Used as an intermediate field before digesting.
	Password string `json:"password,omitempty" db:"-"`
	// Password digested.
	PasswordDigest string `json:"-" db:"password_digest"`
	// Id of the company the user belongs to.
	CompanyId Id `json:"companyId" db:"company_id"`
	// Company model.
	Company *Company `json:"company,omitempty" db:"-"`
	// Id of the person behind the user.
	PersonId Id `json:"personId" db:"person_id"`
	// Person model.
	Person *Person `json:"person,omitempty" db:"-"`
}

// NewUser returns a new instance with default values.
func NewUser() *User {
	return &User{
		Status: "unconfirmed",
	}
}

// DigestPassword digests and clear assigned plain password.
func (u *User) DigestPassword() error {
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

// Validate user data.
func (u *User) Validate(db Database) (validation.Validation, error) {
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
		qb := squirrel.Select("1").From(RelationUsers).
			Where(squirrel.Eq{"email": u.Email}).Limit(1)

		if u.Id != "" {
			qb = qb.Where(squirrel.NotEq{"id": u.Id})
		}

		q, args, err := qb.ToSql()

		if err != nil {
			return nil, err
		}

		if r, err := db.Query(context.Background(), q, args...); err != nil {
			return nil, err
		} else if r.Next() {
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

	// if err := validation.Empty(u.CompanyId); err != nil {
	// 	v.Append("companyId", err)
	// }

	// if err := validation.Empty(u.PersonId); err != nil {
	// 	v.Append("personId", err)
	// }

	return v, nil
}

// Create saves data to the database.
func (u *User) Create(db Database) error {
	if u.Password != "" {
		if err := u.DigestPassword(); err != nil {
			return err
		}
	}

	q, args, err := squirrel.
		Insert(RelationUsers).
		Columns("status", "email", "password_digest", "company_id", "person_id").
		Values(u.Status, u.Email, u.PasswordDigest, u.CompanyId, u.PersonId).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	r, err := db.Query(context.Background(), q, args...)

	if err != nil {
		return err
	}

	*u, err = pgx.CollectOneRow(r, pgx.RowToStructByNameLax[User])

	if err != nil {
		return err
	}

	return nil
}
