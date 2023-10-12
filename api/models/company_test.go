// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import "testing"

func TestCompanyNew(t *testing.T) {
	c := new(Company)
	c.New()

	if c.CreatedAt.IsZero() {
		t.Error("expected created at to not be zero")
	}
	if c.UpdatedAt != c.CreatedAt {
		t.Error("expected updated at to be equal to created at")
	}
}
