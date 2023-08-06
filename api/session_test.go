// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import "testing"

func TestSessionNew(t *testing.T) {
	s := &Session{}
	s.New()

	if s.CreatedAt.IsZero() {
		t.Errorf("expected created at (%s) to not be zero", s.CreatedAt)
	}
	if s.ExpiresAt.Compare(s.CreatedAt) < 1 {
		t.Errorf("expected expires (%s) at to be greater than created at (%s)", s.ExpiresAt, s.CreatedAt)
	}
	if s.User == nil {
		t.Errorf("expected user (%v) to not be nil", s.User)
	}
}
