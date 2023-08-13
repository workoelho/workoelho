// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
)

const (
	// Default session duration.
	SessionDuration = time.Hour * 24
)

// Session holds information about a user session.
type Session struct {
	// Id of the record.
	Id database.Id `output:"id" db:"id"`
	// Date and time when the record was created.
	CreatedAt time.Time `output:"createdAt" db:"created_at"`
	// Date and time when the session expires.
	ExpiresAt time.Time `output:"expiresAt" db:"expires_at"`
	// ID of the owner of the session.
	UserId int `output:"userId" db:"user_id"`
	// Owner of the session.
	User *User `output:"user,omitempty" db:"-"`
	// IP address of the client that started the session.
	RemoteAddr string `output:"remoteAddr" db:"remote_addr"`
	// User agent of the client that started the session.
	UserAgent string `output:"userAgent" db:"user_agent"`
}

// NewSession returns an instance with default values.
func NewSession() *Session {
	s := &Session{}
	s.CreatedAt = time.Now()
	s.ExpiresAt = s.CreatedAt.Add(SessionDuration)
	s.User = &User{}
	return s
}

// Table name of the model.
func (*Session) Table() string {
	return "sessions"
}

// Create inserts the struct values into the database.
func (s *Session) Create(req Request) error {
	q, args, err := squirrel.Insert(s.Table()).
		Columns("created_at", "expires_at", "user_id", "remote_addr", "user_agent").
		Values(s.CreatedAt, s.ExpiresAt, s.UserId, s.RemoteAddr, s.UserAgent).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	tx, err := req.Tx()
	if err != nil {
		return err
	}

	rows, err := tx.Query(req.Context(), q, args...)
	if err != nil {
		return err
	}
	defer rows.Close()

	*s, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[Session])
	if err != nil {
		return err
	}

	return nil
}
