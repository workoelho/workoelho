// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package validation

import (
	"testing"
)

func TestEmpty(t *testing.T) {
	if err := Empty(""); err == nil {
		t.Error("expected empty string to fail")
	} else {
		if err.Issue != "empty" {
			t.Error("expected error to have issue equal to 'empty'")
		}
	}

	if err := Empty(0); err != nil {
		t.Error("expected value 0 to pass")
	}

	if err := Empty(false); err != nil {
		t.Error("expected value false to pass")
	}

	if err := Empty(nil); err == nil {
		t.Error("expected nil to fail")
	}
}

func TestFormat(t *testing.T) {
	if err := Format("test", "email"); err == nil {
		t.Error("expected invalid email to fail")
	} else {
		if err.Issue != "format" {
			t.Error("expected error to have issue equal to 'format'")
		}
		if err.Detail["format"] != "email" {
			t.Error("expected error detail to have format equal to 'email'")
		}
	}

	if err := Format("me@example.org", "email"); err != nil {
		t.Error("expected valid email to pass")
	}
}

func TestLength(t *testing.T) {
	if err := Length("", 1, 2); err == nil {
		t.Error("expected empty string to fail")
	} else {
		if err.Issue != "length" {
			t.Error("expected error to have issue equal to 'length'")
		}
		if err.Detail["minimum"] != 1 {
			t.Error("expected error detail to have min equal to 1")
		}
		if err.Detail["maximum"] != 2 {
			t.Error("expected error detail to have max equal to 2")
		}
	}

	if err := Length("a", 1, 2); err != nil {
		t.Error("expected string with length 1 to pass")
	}

	if err := Length("ab", 1, 2); err != nil {
		t.Error("expected string with length 2 to pass")
	}

	if err := Length("abc", 1, 2); err == nil {
		t.Error("expected string with length 3 to fail")
	}
}

func TestNew(t *testing.T) {
	v := New()

	if len(v) != 0 {
		t.Error("expected validation to be empty")
	}
}

func TestValidationAppend(t *testing.T) {
	v := New()

	if v.Append("a", &Error{}); len(v) != 1 {
		t.Error("expected validation to have 1 error")
	}

	if v[0].Field != "a" {
		t.Error("expected error to have field equal to 'a'")
	}

	if v.Append("b", &Error{}); len(v) != 2 {
		t.Error("expected validation to have 2 errors")
	}

	if v[1].Field != "b" {
		t.Error("expected error to have field equal to 'b'")
	}
}

func TestValidationCheck(t *testing.T) {
	v := New()

	v.Append("a", &Error{"a", "empty", nil})
	v.Append("b", &Error{"b", "empty", nil})
	v.Append("a", &Error{"a", "format", nil})

	if !v.Check("a", "empty") {
		t.Error("expected validation to have error with field 'a' and issue 'empty'")
	}

	if !v.Check("a", "format") {
		t.Error("expected validation to have error with field 'a' and issue 'format'")
	}

	if !v.Check("b", "empty") {
		t.Error("expected validation to have error with field 'b' and issue 'empty'")
	}

	if v.Check("b", "format") {
		t.Error("expected validation to not have error with field 'b' and issue 'format'")
	}

	if v.Check("c", "empty") {
		t.Error("expected validation to not have error with field 'c' and issue 'empty'")
	}
}
