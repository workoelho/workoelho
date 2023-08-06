// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package sanitization

import (
	"fmt"
	"reflect"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// Tag key.
const key = "sanitize"

// parseTag parses tag string into a map of sanitizations.
func parseTag(tag string) map[string]string {
	sanitizations := map[string]string{}
	for _, t := range strings.Split(tag, ",") {
		if i := strings.Index(t, "="); i > -1 {
			sanitizations[t[:i]] = t[i+1:]
		} else {
			sanitizations[t] = ""
		}
	}
	return sanitizations
}

// String returns a sanitized string, according to the given tag.
// Tag is a comma separated list of sanitizations.
// Supported sanitizations for string are 'trim', 'squeeze', 'lower', 'title', 'upper'.
func String(s string, tag string) string {
	sanitizations := parseTag(tag)
	if _, ok := sanitizations["squeeze"]; ok {
		s = strings.Join(strings.Fields(s), " ")
	}
	if _, ok := sanitizations["trim"]; ok {
		s = strings.TrimSpace(s)
	}
	if _, ok := sanitizations["lower"]; ok {
		s = cases.Lower(language.English).String(s)
	}
	if _, ok := sanitizations["title"]; ok {
		s = cases.Title(language.English).String(s)
	}
	if _, ok := sanitizations["upper"]; ok {
		s = cases.Upper(language.English).String(s)
	}
	return s
}

// Struct sanitizes struct fields.
func Struct(target interface{}) error {
	v := reflect.ValueOf(target).Elem()

	if v.Kind() != reflect.Struct {
		return fmt.Errorf("sanitization: expected struct, got %s", v.Kind())
	}

	t := reflect.TypeOf(target).Elem()

	for i := 0; i < v.NumField(); i++ {
		tag := t.Field(i).Tag.Get(key)

		if tag == "" {
			continue
		}

		switch f := v.Field(i); f.Kind() {
		case reflect.String:
			f.SetString(String(f.String(), tag))
		}
	}
	return nil
}
