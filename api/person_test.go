// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import "testing"

func TestNewPerson(t *testing.T) {
	p := NewPerson()

	if p == nil {
		t.Error("expected person not to be nil")
	}
}
