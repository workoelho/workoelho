// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import "time"

// Database relation name.
const (
	RelationSessions = "sessions"
)

// Session ...
type Session struct {
	Id         Id         `json:"id" db:"id"`
	CreatedAt  *time.Time `json:"createdAt" db:"created_at"`
	ExpiresAt  *time.Time `json:"expiresAt" db:"expires_at"`
	UserId     int        `json:"userId" db:"user_id"`
	User       *User      `json:"user,omitempty" db:"-"`
	RemoteAddr string     `json:"remoteAddr" db:"remote_addr"`
	UserAgent  string     `json:"userAgent" db:"user_agent"`
}
