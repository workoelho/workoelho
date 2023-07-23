package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/haggen/workoelho/web"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

// Record ID type.
type Id int

// Violation ...
type Violation struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

// Database tables.
const (
	TableUsers     = "users"
	TableCompanies = "companies"
	TableSessions  = "sessions"
)

// Session ...
type Session struct {
	Id         Id         `json:"id" db:"id"`
	CreatedAt  *time.Time `json:"createdAt" db:"created_at"`
	ExpiresAt  *time.Time `json:"expiresAt" db:"expires_at"`
	UserId     int        `json:"userId" db:"user_id"`
	RemoteAddr string     `json:"remoteAddr" db:"remote_addr"`
	UserAgent  string     `json:"userAgent" db:"user_agent"`
}

// Company ...
type Company struct {
	Id        Id         `json:"id" db:"id"`
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	Name      string     `json:"name" db:"name"`
}

// Validate ...
func (c *Company) Validate() []error {
	e := []error{}

	if c.Name == "" {
		e = append(e, errors.New("name is required"))
	}

	return e
}

// Create ...
func (c *Company) Create(tx pgx.Tx) error {
	q, _, err := squirrel.
		Insert(TableCompanies).Columns("name").
		Values(c.Name).
		Suffix(`RETURNING "id"`).ToSql()

	if err != nil {
		return err
	}

	if err := tx.QueryRow(context.Background(), q).Scan(&c.Id); err != nil {
		return err
	}

	return nil
}

// Person ...
type Person struct {
	Id        Id         `json:"id" db:"id"`
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	Name      string     `json:"name" db:"name"`
}

// Validate ...
func (p *Person) Validate() []error {
	return []error{}
}

// Create ...
func (p *Person) Create(tx pgx.Tx) error {
	q, _, err := squirrel.
		Insert("people").Columns("name").
		Values(p.Name).
		Suffix(`RETURNING "id"`).ToSql()

	if err != nil {
		return err
	}

	if err := tx.QueryRow(context.Background(), q).Scan(&p.Id); err != nil {
		return err
	}

	return nil
}

// User ...
type User struct {
	Id        Id         `json:"id" db:"id"`
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	Status    string     `json:"status" db:"status"`
	Email     string     `json:"email" db:"email"`
	Password  string     `json:"-" db:"password"`
	CompanyId int        `json:"companyId" db:"company_id"`
	PersonId  int        `json:"personId" db:"person_id"`
}

// UserStatus ...
const (
	UserStatusUnconfirmed = "unconfirmed"
	UserStatusActive      = "active"
	UserStatusBlocked     = "blocked"
)

// CreatePassword save password digest
func (u *User) CreatePassword(password string) error {
	digest, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(digest)
	return nil
}

// ComparePassword compares given password with the user's password digest.
func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

// Validate ...
func (u *User) Validate() []error {
	return []error{}
}

// Create ...
func (u *User) Create(tx pgx.Tx) error {
	q, _, err := squirrel.
		Insert("users").Columns("email", "password").
		Values(u.Email, u.Password).
		Suffix(`RETURNING "id"`).ToSql()

	if err != nil {
		return err
	}

	if err := tx.QueryRow(context.Background(), q).Scan(&u.Id); err != nil {
		return err
	}

	return nil
}

func v1APIHandler(db *pgxpool.Pool) web.Middleware {
	mux := http.NewServeMux()

	mux.HandleFunc("/v1/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {
		case http.MethodPost:
			u := &User{}

			if err := json.NewDecoder(r.Body).Decode(u); err != nil {
				panic(err)
			}

			tx, err := db.Begin(r.Context())
			if err != nil {
				panic(err)
			}
			defer tx.Rollback(r.Context())

			if err := u.Create(tx); err != nil {
				panic(err)
			}

			if err := tx.Commit(r.Context()); err != nil {
				panic(err)
			}

			w.WriteHeader(http.StatusCreated)

			if err := json.NewEncoder(w).Encode(u); err != nil {
				panic(err)
			}
		default:
			w.Header().Set("Allow", "POST")
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !strings.HasPrefix(r.URL.Path, "/v1/") {
				next.ServeHTTP(w, r)
				return
			}
			mux.ServeHTTP(w, r)
		})
	}
}

func main() {
	db, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	w := web.New()

	w.Use(web.RecoverHandler())
	w.Use(web.RequestIDHandler())
	w.Use(web.RemoteAddrHandler())
	w.Use(web.LoggingHandler())
	w.Use(web.RateLimiterHandler())
	w.Use(web.CORSHandler())
	w.Use(v1APIHandler(db))

	w.Listen(":" + os.Getenv("PORT"))
}
