// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package validation

import (
	"fmt"
	"net/mail"
	"reflect"
)

// Detail contains additional information about a validation error.
type Detail map[string]interface{}

// Error describes a validation error.
type Error struct {
	// Field that failed validation.
	Field string `output:"field"`
	// What's the issue with the value, e.g. "empty", "format", "length"
	Issue string `output:"issue"`
	// Additional details about the validation. e.g. minimum length.
	Detail Detail `output:"detail,omitempty"`
}

// Error returns a description of the validation error.
func (e *Error) Error() string {
	return fmt.Sprintf("validation: %s (%+v)", e.Issue, e.Detail)
}

// Empty returns an error if the value is considered empty.
// i.e. "", nil or []. Initial values like 0 and false are not considered empty.
func Empty[T any](value T) *Error {
	switch v := reflect.ValueOf(value); v.Kind() {
	case reflect.Ptr, reflect.String, reflect.Slice:
		if v.IsZero() {
			return &Error{"", "empty", nil}
		}
	}

	return nil
}

// Format returns an error if the string doesn't match a given format.
// Available formats are "email".
func Format(value, format string) *Error {
	detail := Detail{"format": format}

	switch format {
	case "email":
		if _, err := mail.ParseAddress(value); err != nil {
			return &Error{"", "format", detail}
		}
	}
	return nil
}

// Length returns an error if the string or slice has a length outside a given range.
func Length(value interface{}, minimum, maximum int) *Error {
	detail := Detail{"minimum": minimum, "maximum": maximum}

	switch v := value.(type) {
	case string:
		if len(v) < minimum || len(v) > maximum {
			return &Error{"", "length", detail}
		}
	case []interface{}:
		if len(v) < minimum || len(v) > maximum {
			return &Error{"", "length", detail}
		}
	}
	return nil
}

// Unknown returns an error if the value isn't in a list of options.
func Unknown(value string, options []string) *Error {
	for _, option := range options {
		if value == option {
			return nil
		}
	}
	return &Error{"", "unknown", Detail{"options": options}}
}

// Validation is a collection of validation errors.
type Validation []*Error

// New creates a new validation.
func New() Validation {
	return Validation{}
}

// Error returns a description of the validation errors.
func (v Validation) Error() string {
	return fmt.Sprintf("validation: %d errors", len(v))
}

// Empty tests if the validation has no errors.
func (v Validation) Empty() bool {
	return len(v) == 0
}

// Append updates the collection with a given validation error.
func (v *Validation) Append(field string, err *Error) {
	err.Field = field
	*v = append(*v, err)
}

// Check tests if a given field has a given issue.
func (v *Validation) Check(field, issue string) bool {
	for _, err := range *v {
		if err.Field == field && err.Issue == issue {
			return true
		}
	}
	return false
}
