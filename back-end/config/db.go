package config

import (
	"api/model"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func SetupDatabase() error {
	godotenv.Load()

	connection := fmt.Sprintf("%s:%s@tcp(%s:%s)/", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"))
	db, err := gorm.Open(mysql.Open(connection), &gorm.Config{NamingStrategy: schema.NamingStrategy{SingularTable: true}})

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	db.Exec("CREATE DATABASE IF NOT EXISTS blog")

	dsnWithDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_DATABASE"))
	db, err = gorm.Open(mysql.Open(dsnWithDB), &gorm.Config{NamingStrategy: schema.NamingStrategy{SingularTable: true}})

	if err != nil {
		return fmt.Errorf("failed to connect to 'blog' database: %w", err)
	}

	DB = db

	DB.AutoMigrate(&model.User{}, &model.Blog{})

	return nil
}
