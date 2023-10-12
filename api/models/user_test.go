// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import (
	"context"
	"testing"

	"github.com/pashagolub/pgxmock/v2"
	"github.com/workoelho/workoelho/validation"
)

func TestUserNew(t *testing.T) {
	u := new(User)
	u.New()

	if u.CreatedAt.IsZero() {
		t.Error("expected created at to not be zero")
	}
	if u.UpdatedAt != u.CreatedAt {
		t.Error("expected updated at to be equal to created at")
	}
	if u.Status != "unconfirmed" {
		t.Error("expected status to have a default value")
	}
	if u.Company == nil {
		t.Error("expected company to not be nil")
	}
	if u.Person == nil {
		t.Error("expected person to not be nil")
	}
}

func TestUserDigestPassword(t *testing.T) {
	u := new(User)
	u.New()

	if err := u.DigestPassword(); err != nil {
		t.Error("expected digesting empty password not to fail")
	}

	u.Password = "123"
	u.DigestPassword()

	if u.Password != "" {
		t.Error("expected plain password to be empty after digestion")
	} else if u.PasswordDigest == "" {
		t.Error("expected digest not to be empty")
	}
}

func TestUserValidate(t *testing.T) {
	db, err := pgxmock.NewPool()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	u := new(User)

	if err := u.Validate(context.Background(), db); err != nil {
		if err, ok := err.(validation.Validation); !ok {
			t.Fatal(err)
		} else {
			if !err.Check("companyId", "empty") {
				t.Error("expected empty company id to fail validation")
			}

			if !err.Check("personId", "empty") {
				t.Error("expected empty person id to fail validation")
			}

			if !err.Check("status", "empty") {
				t.Error("expected empty status to fail empty validation")
			}

			if !err.Check("email", "empty") {
				t.Error("expected empty email to fail empty validation")
			}

			if !err.Check("password", "empty") {
				t.Error("expected empty password to fail empty validation")
			}
		}
	}

	u.PasswordDigest = "password"

	if err := u.Validate(context.Background(), db); err != nil {
		if err, ok := err.(validation.Validation); !ok {
			t.Fatal(err)
		} else {
			if err.Check("password", "empty") {
				t.Error("expected digest password to skip password empty validation")
			}
		}
	}

	u.Email = "invalid"
	u.Status = "invalid"
	u.Password = "invalid"

	if err := u.Validate(context.Background(), db); err != nil {
		if err, ok := err.(validation.Validation); !ok {
			t.Fatal(err)
		} else {

			if !err.Check("status", "unknown") {
				t.Error("expected invalid status to fail validation")
			}

			if !err.Check("email", "format") {
				t.Error("expected invalid email to fail validation")
			}

			if !err.Check("password", "length") {
				t.Error("expected short password to fail validation")
			}
		}
	}

	u.CompanyId = "1"
	u.PersonId = "1"
	u.Status = "active"
	u.Email = "me@example.org"
	u.Password = "0123456789abcdef"

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).
		WillReturnRows(pgxmock.NewRows([]string{""}).AddRow(1))

	if err, ok := u.Validate(context.Background(), db).(validation.Validation); !ok {
		t.Fatal(err)
	} else {
		if !err.Check("email", "taken") {
			t.Error("expected taken email to fail validation")
		}
	}

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).WillReturnRows(pgxmock.NewRows([]string{""}))

	if err := u.Validate(context.Background(), db); err != nil {
		if err, ok := err.(validation.Validation); !ok {
			t.Fatal(err)
		} else {
			if !err.Empty() {
				t.Error("expected valid user to pass")
			}
		}
	}
}

func TestUserCreate(t *testing.T) {
	db, err := pgxmock.NewPool()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	db.ExpectBegin()

	tx, err := db.Begin(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	defer tx.Rollback(context.Background())

	// session := NewSession()

	// ctx := new(fiber.Ctx)
	// ctx.Locals("db", db)
	// ctx.Locals("tx", tx)
	// ctx.Locals("session", session)

	// u := new(User)
	// u.New()

	// now := time.Now()

	// db.ExpectQuery("INSERT INTO users").
	// 	WithArgs(u.Status, u.Email, u.PasswordDigest, u.CompanyId, u.PersonId).
	// 	WillReturnRows(pgxmock.
	// 		NewRows([]string{"id", "created_at", "updated_at", "deleted_at", "status", "email", "password_digest", "company_id", "person_id"}).
	// 		AddRow(database.Id("1"), now, now, nil, "active", "me@example.org", "0123456789abcdef", database.Id("1"), database.Id("1")))

	// if err := u.Create(ctx); err != nil {
	// 	t.Fatal(err)
	// }

	// if u.Id != "1" {
	// 	t.Error("expected user to have the returning id")
	// }

	// if !u.CreatedAt.Equal(now) {
	// 	t.Error("expected user to have the returning created at")
	// }

	// if !u.UpdatedAt.Equal(now) {
	// 	t.Error("expected user to have the returning updated at")
	// }

	// if u.Status != "active" {
	// 	t.Error("expected user to have the returning status")
	// }

	// if u.Email != "me@example.org" {
	// 	t.Error("expected user to have the returning email")
	// }

	// if u.PasswordDigest != "0123456789abcdef" {
	// 	t.Error("expected user to have the returning password digest")
	// }

	// if u.CompanyId != "1" {
	// 	t.Error("expected user to have the returning company id")
	// }

	// if u.PersonId != "1" {
	// 	t.Error("expected user to have the returning person id")
	// }
}
