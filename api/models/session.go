// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package models

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/workoelho/workoelho/database"
)

const (
	// Default session duration.
	DefaultDuration = time.Hour * 24
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
	UserId database.Id `output:"userId" db:"user_id"`
	// Owner of the session.
	User *User `output:"user,omitempty" db:"-"`
	// IP address of the client that started the session.
	RemoteAddr string `output:"remoteAddr" db:"remote_addr"`
	// User agent of the client that started the session.
	UserAgent string `output:"userAgent" db:"user_agent"`
}

// New resets all fields to their default values.
func (s *Session) New() {
	s.Id = ""
	s.CreatedAt = time.Now()
	s.ExpiresAt = s.CreatedAt.Add(DefaultDuration)
	s.UserId = ""
	s.User = nil
	s.RemoteAddr = ""
	s.UserAgent = ""
}

// Table name on the database.
func (*Session) Table() string {
	return "sessions"
}

// Create inserts a new record into the database.
func (s *Session) Create(ctx context.Context, tx pgx.Tx) error {
	q, args, err := squirrel.Insert(s.Table()).
		Columns("created_at", "expires_at", "user_id", "remote_addr", "user_agent").
		Values(s.CreatedAt, s.ExpiresAt, s.UserId, s.RemoteAddr, s.UserAgent).
		Suffix(`RETURNING *`).ToSql()

	if err != nil {
		return err
	}

	rows, err := tx.Query(context.Background(), q, args...)
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
