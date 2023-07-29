// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"testing"

	"github.com/pashagolub/pgxmock/v2"
)

func TestNewUser(t *testing.T) {
	u := NewUser()

	if u == nil {
		t.Error("user expected not to be nil")
	} else if u.Status != "unconfirmed" {
		t.Error("status expected to have a default value")
	}
}

func TestUserCreatePassword(t *testing.T) {
	u := NewUser()
	u.Password = "123"
	u.DigestPassword()

	if u.Password != "" {
		t.Error("password expected to be empty")
	} else if u.PasswordDigest == "" {
		t.Error("password digest expected not to be empty")
	}
}

func TestUserValidate(t *testing.T) {
	db, err := pgxmock.NewPool()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	u := &User{}

	v, err := u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if !v.Check("status", "empty") {
		t.Error("expected empty status to fail empty validation")
	}

	if !v.Check("email", "empty") {
		t.Error("expected empty email to fail empty validation")
	}

	if !v.Check("password", "empty") {
		t.Error("expected empty password to fail empty validation")
	}

	u.Email = "test"
	u.Status = "invalid"
	u.Password = "123"

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if !v.Check("status", "unknown") {
		t.Error("expected invalid status to fail unknown validation")
	}

	if !v.Check("email", "format") {
		t.Error("expected invalid email to fail format validation")
	}

	if !v.Check("password", "length") {
		t.Error("expected short password to fail length validation")
	}

	u.Status = "active"
	u.Email = "me@example.org"
	u.Password = "0123456789abcdef"

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).
		WillReturnRows(pgxmock.NewRows([]string{""}).AddRow(1))

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if !v.Check("email", "taken") {
		t.Error("expected taken email to fail validation")
	}

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).WillReturnRows(pgxmock.NewRows([]string{""}))

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if len(v) > 0 {
		t.Error("expected user to pass validation")
	}
}
