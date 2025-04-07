package controller

import (
	"api/config"
	"api/model"
	"api/token"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct {
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Panic(err)
	}

	return string(bytes)
}

func VerifyPassword(userpassword string, givenpassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(givenpassword), []byte(userpassword))
	return bool(err == nil)
}

func (con *UserController) SignUp(c *gin.Context) {

	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Password = HashPassword(user.Password)
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})

}

func (con *UserController) Login(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var storedUser model.User
	if err := config.DB.Where("email = ?", user.Email).First(&storedUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !VerifyPassword(user.Password, storedUser.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	jwtToken, err := token.GenerateToken(storedUser.Email, storedUser.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   jwtToken,
		"userid":  storedUser.ID,
		"name":    storedUser.Firstname + " " + storedUser.Lastname,
	})
}
