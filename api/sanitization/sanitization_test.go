// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package sanitization

import (
	"testing"
)

func TestString(t *testing.T) {
	examples := map[string][]string{
		"trim":    {"  trim example  ", "trim example"},
		"squeeze": {"squeeze  example", "squeeze example"},
		"lower":   {"LOWER", "lower"},
		"title":   {"title", "Title"},
		"upper":   {"upper", "UPPER"},
	}

	for sanitization, example := range examples {
		if r := String(example[0], sanitization); r != example[1] {
			t.Errorf("expected string (%s) to be sanitized (%s)", example[0], r)
		}
	}
}

func TestStruct(t *testing.T) {
	example := &struct {
		A string `sanitize:"trim"`
		B string `sanitize:"lower"`
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
