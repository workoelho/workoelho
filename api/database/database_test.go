// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package database

import (
	"testing"
)

func TestOpen(t *testing.T) {
	Open()

	if pool == nil {
		t.Error("expected pool to be instantiated")
	}
}
