// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import "testing"

func TestSessionNew(t *testing.T) {
	session := new(Session)
	session.New()

	if session.CreatedAt.IsZero() {
		t.Errorf("expected created at (%s) to not be zero", session.CreatedAt)
	}
	if session.ExpiresAt.Compare(session.CreatedAt) < 1 {
		t.Errorf("expected expires (%s) at to be greater than created at (%s)", session.ExpiresAt, session.CreatedAt)
	}
	if session.User == nil {
		t.Errorf("expected user (%v) to not be nil", session.User)
	}
}
