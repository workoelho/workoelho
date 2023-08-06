// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package sanitization

import (
	"testing"
)

func TestString(t *testing.T) {
	if String(" Example ", "trim,lowercase") != "example" {
		t.Error("expected string to be sanitized")
	}
}

func TestStruct(t *testing.T) {
	example := &struct {
		A string `sanitize:"trim"`
		B string `sanitize:"lowercase"`
	}{" example ", "Example"}

	if err := Struct(example); err != nil {
		t.Error(err)
	}

	if example.A != "example" {
		t.Error("expected struct field to be trimmed")
	}
	if example.B != "example" {
		t.Error("expected struct field to be lowercased")
	}
}
