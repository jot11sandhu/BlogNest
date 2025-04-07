package model

type User struct {
	ID        int    `gorm:"primaryKey"`
	Email     string `gorm:"not null"`
	Password  string `gorm:"not null"`
	Firstname string `gorm:"not null"`
	Lastname  string `gorm:"not null"`
	Blogs     []Blog `gorm:"foreignKey:UserID"`
}
