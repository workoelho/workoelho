// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package sanitization

import (
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// Collapse returns a copy of the string with all consecutive whitespace collapsed into a single space character.
func Collapse(s string) string {
	return strings.Join(strings.Fields(s), " ")
}

// Trim returns a copy of the string without leading and trailing whitespace.
func Trim(s string) string {
	return strings.TrimSpace(s)
}

// Condense returns a copy of the string with through Collapse and Trim.
func Condense(s string) string {
	return Trim(Collapse(s))
}

// Lower returns a copy of the string with all characters changed to lowercase.
func Lower(s string) string {
	return cases.Lower(language.English).String(s)
}

// Title returns a copy of the string with capitalized initials.
func Title(s string) string {
	return cases.Title(language.English).String(s)
}

// Lower returns a copy of the string with all characters changed to uppercase.
func Upper(s string) string {
	return cases.Upper(language.English).String(s)
}
