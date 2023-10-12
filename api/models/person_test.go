// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import "testing"

func TestPersonNew(t *testing.T) {
	p := new(Person)
	p.New()

	if p.CreatedAt.IsZero() {
		t.Error("expected created at to not be zero")
	}
	if p.UpdatedAt != p.CreatedAt {
		t.Error("expected updated at to be equal to created at")
	}
}
