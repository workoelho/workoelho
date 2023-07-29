// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package main

import (
	"time"
)

// Database relation name.
const (
	RelationCompanies = "companies"
)

// Company ...
type Company struct {
	Id        Id         `json:"id" db:"id"`
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
	Name      string     `json:"name" db:"name"`
}
