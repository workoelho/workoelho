// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package helpers

import (
	"fmt"
	"reflect"
)

// Tag returns the value of a tag in the struct's field.
func Tag(s interface{}, field string, tag string) string {
	f, ok := reflect.TypeOf(s).Elem().FieldByName(field)
	if !ok {
		panic(fmt.Sprintf(`Tag(): field "%s" not found in %v`, field, s))
	}
	return f.Tag.Get(tag)
}
