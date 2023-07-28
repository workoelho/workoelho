package main

import (
	"reflect"
	"testing"

	"github.com/pashagolub/pgxmock/v2"
)

func (ve *Validations) TestError(field, rule string, detail map[string]interface{}) bool {
	for _, err := range *ve {
		if err.Field == field && err.Rule == rule && reflect.DeepEqual(err.Detail, detail) {
			return true
		}
	}
	return false
}

func TestNewUser(t *testing.T) {
	u := NewUser()

	if u == nil {
		t.Error("user expected not to be nil")
	} else if u.Status != UserStatusUnconfirmed {
		t.Error("status expected to have a default value")
	}
}

func TestUserCreatePassword(t *testing.T) {
	u := NewUser()
	u.Password = "123"
	u.CreatePassword()

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

	if !v.TestError("status", ValidationRuleRequired, nil) {
		t.Error("user validation expected to whine about empty status")
	}

	if !v.TestError("email", ValidationRuleRequired, nil) {
		t.Error("user validation expected to whine about empty email")
	}

	if !v.TestError("password", ValidationRuleRequired, nil) {
		t.Error("user validation expected to whine about empty password")
	}

	u.Email = "test"
	u.Status = "status"
	u.Password = "123"

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if !v.TestError("email", ValidationRuleFormat, map[string]interface{}{"format": "email"}) {
		t.Error("user validation expected to whine about invalid email")
	}

	if !v.TestError("password", ValidationRuleLength, map[string]interface{}{"minimum": 12}) {
		t.Error("user validation expected to whine about invalid email")
	}

	u.Email = "test@example.org"
	u.Password = "123456789abc"

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).
		WillReturnRows(pgxmock.NewRows([]string{""}).AddRow(1))

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if !v.TestError("email", ValidationRuleUnique, nil) {
		t.Error("user validation expected to whine about duplicate email")
	}

	db.ExpectQuery("SELECT 1").WithArgs(u.Email).WillReturnRows(pgxmock.NewRows([]string{""}))

	v, err = u.Validate(db)

	if err != nil {
		t.Fatal(err)
	}

	if len(v) > 0 {
		t.Error("user validation expected to pass")
	}
}
