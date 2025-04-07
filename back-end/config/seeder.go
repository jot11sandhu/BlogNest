package config

import (
	"api/model"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func SeedDatabase() {
	var count int64
	DB.Model(&model.User{}).Count(&count)

	if count == 0 {
		users := []model.User{
			{
				Email:     "alex.johnson@gmail.com",
				Password:  hashedPassword("password"),
				Firstname: "Alex",
				Lastname:  "Johnson",
			},
			{
				Email:     "alex.wilson@yahoo.com",
				Password:  hashedPassword("password"),
				Firstname: "Alex",
				Lastname:  "Wilson",
			},
			{
				Email:     "john.kate@yahoo.com",
				Password:  hashedPassword("password"),
				Firstname: "John",
				Lastname:  "Kate",
			},
			{
				Email:     "alex.taylor@yahoo.com",
				Password:  hashedPassword("password"),
				Firstname: "Alex",
				Lastname:  "Taylor",
			},
			{
				Email:     "john.johnson@hotmail.com",
				Password:  hashedPassword("password"),
				Firstname: "John",
				Lastname:  "Johnson",
			},
		}

		for _, user := range users {
			if err := DB.Create(&user).Error; err != nil {
				log.Println("Failed to seed user:", err)
				return
			}
		}

		blogs := []model.Blog{
			{
				Title:           "Welcome Blog",
				Content:         "This is the first blog post!",
				PublicationDate: time.Now(),
				UserID:          1,
				Tags:            "Introduction",
			},
			{
				Title:           "Tech Trends 2025",
				Content:         "Exploring the latest tech trends and innovations of 2025.",
				PublicationDate: time.Now(),
				UserID:          1,
				Tags:            "Technology, Trends",
			},
			{
				Title:           "My Travel Journal",
				Content:         "Documenting my adventures around the world.",
				PublicationDate: time.Now(),
				UserID:          2,
				Tags:            "Travel, Adventure",
			},
			{
				Title:           "Healthy Living Tips",
				Content:         "Tips and tricks to live a healthier and happier life.",
				PublicationDate: time.Now(),
				UserID:          2,
				Tags:            "Health, Wellness",
			},
			{
				Title:           "Beginner's Guide to Coding",
				Content:         "A beginner-friendly guide to starting your coding journey.",
				PublicationDate: time.Now(),
				UserID:          3,
				Tags:            "Coding, Programming, Guide",
			},
			{
				Title:           "Photography Essentials",
				Content:         "Essential tips and techniques for beginner photographers.",
				PublicationDate: time.Now(),
				UserID:          3,
				Tags:            "Photography, Tips",
			},
			{
				Title:           "Life in 2025",
				Content:         "Speculating on what the world will look like in the year 2025.",
				PublicationDate: time.Now(),
				UserID:          4,
				Tags:            "Future, Life",
			},
			{
				Title:           "Cooking for Beginners",
				Content:         "Easy recipes and cooking tips for people just starting out in the kitchen.",
				PublicationDate: time.Now(),
				UserID:          4,
				Tags:            "Cooking, Recipes",
			},
			{
				Title:           "Mindfulness and Meditation",
				Content:         "An introduction to mindfulness practices and meditation.",
				PublicationDate: time.Now(),
				UserID:          5,
				Tags:            "Mindfulness, Meditation, Wellness",
			},
			{
				Title:           "How to Build a Website",
				Content:         "Step-by-step guide to building a website from scratch.",
				PublicationDate: time.Now(),
				UserID:          5,
				Tags:            "Web Development, Guide",
			},
		}

		for _, blog := range blogs {
			if err := DB.Create(&blog).Error; err != nil {
				log.Println("Failed to seed blog:", err)
				return
			}
		}
	}
}

func hashedPassword(password string) string {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword)
}
