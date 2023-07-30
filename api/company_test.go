// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import "testing"

func TestNewCompany(t *testing.T) {
	c := NewCompany()

	if c == nil {
		t.Error("expected company not to be nil")
	}
}
