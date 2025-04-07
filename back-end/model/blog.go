package model

import (
	"time"
)

type Blog struct {
	ID              int       `gorm:"primaryKey"`
	Title           string    `gorm:"not null"`
	Content         string    `gorm:"not null"`
	UserID          int       `gorm:"not null"`
	User            User      `gorm:"foreignKey:UserID"`
	PublicationDate time.Time `gorm:"not null"`
	Tags            string
}
