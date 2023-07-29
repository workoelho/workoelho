// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package validation

import (
	"fmt"
	"net/mail"
)

// Detail contains additional information about a validation error.
type Detail map[string]interface{}

// Error describes a validation error.
type Error struct {
	// Field that failed validation.
	Field string `json:"field"`
	// What's the issue with the value, e.g. "empty", "format", "length"
	Issue string `json:"issue"`
	// Additional details about the validation. e.g. minimum length.
	Detail Detail `json:"detail,omitempty"`
}

// Error returns a description of the validation error.
func (e *Error) Error() string {
	return fmt.Sprintf("validation: %s (%+v)", e.Issue, e.Detail)
}

// Empty checks if a given value is empty.
// i.e. "", nil or []. Zero values like 0 and false are not considered empty.
func Empty(value interface{}) *Error {
	switch v := value.(type) {
	case string:
		if v == "" {
			return &Error{"", "empty", nil}
		}
	case []interface{}:
		if len(v) == 0 {
			return &Error{"", "empty", nil}
		}
	case nil:
		return &Error{"", "empty", nil}
	}

	return nil
}

// Format checks if a given string matches a given format.
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

// Length checks if a given string or slice has a length within a given range.
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

// Unknown checks if a given value is among a list of options.
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

// Append updates the collection with a given validation error.
func (v *Validation) Append(field string, err *Error) {
	err.Field = field
	*v = append(*v, err)
}

// Check checks if a given field has a given issue.
func (v *Validation) Check(field, issue string) bool {
	for _, err := range *v {
		if err.Field == field && err.Issue == issue {
			return true
		}
	}
	return false
}
