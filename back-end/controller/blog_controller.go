package controller

import (
	"api/config"
	"api/model"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BlogController struct {
}

func (con *BlogController) Create(c *gin.Context) {
	var blog model.Blog

	// Validate JSON input
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userIDVal, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Convert user ID to int
	userID, ok := userIDVal.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token"})
		return
	}

	// Set the publication date to current time
	blog.PublicationDate = time.Now()
	blog.UserID = userID

	// Optionally validate foreign keys like UserID
	if blog.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	// Create the blog
	if err := config.DB.Create(&blog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create blog"})
		return
	}

	c.JSON(http.StatusCreated, blog)
}

func (con *BlogController) GetByID(c *gin.Context) {
	var blog model.Blog
	id := c.Param("id")

	// Check if blog exists
	if err := config.DB.Preload("User").First(&blog, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	blog.User.Email = ""
	blog.User.Password = ""

	c.JSON(http.StatusOK, blog)
}

func (con *BlogController) GetAll(c *gin.Context) {
	var blogs []model.Blog

	if err := config.DB.Find(&blogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch blogs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"blogs": blogs,
	})
}

func (con *BlogController) GetAllByUserID(c *gin.Context) {
	var blogs []model.Blog
	userID := c.Param("userid")
	err := config.DB.Where("user_id = ?", userID).Find(&blogs).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if len(blogs) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No blogs found for this user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"blogs": blogs,
	})
}

func (con *BlogController) Update(c *gin.Context) {
	var blog model.Blog
	id := c.Param("id")

	// Check if blog exists
	if err := config.DB.First(&blog, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Bind incoming JSON and update fields
	var updatedData model.Blog
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Update fields
	blog.Title = updatedData.Title
	blog.Content = updatedData.Content
	blog.Tags = updatedData.Tags

	if err := config.DB.Save(&blog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blog"})
		return
	}

	c.JSON(http.StatusOK, blog)
}

func (con *BlogController) Delete(c *gin.Context) {
	var blog model.Blog
	id := c.Param("id")

	// Check if blog exists
	if err := config.DB.First(&blog, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Delete the blog
	if err := config.DB.Delete(&blog).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete blog"})
		return
	}

	c.Status(http.StatusOK)
}
