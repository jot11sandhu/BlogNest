package router

import (
	"api/controller"
	"api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() {
	userController := controller.UserController{}
	blogController := controller.BlogController{}

	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}

	router := gin.Default()
	router.Use(cors.New(corsConfig))
	router.Group("/api").
		POST("/signup", userController.SignUp).
		POST("/login", userController.Login).
		GET("/blog/all", blogController.GetAll)

	router.Use(middleware.Authentication())
	router.Group("/api").
		POST("/blog", blogController.Create).
		GET("/blog/:id", blogController.GetByID).
		PUT("/blog/:id", blogController.Update).
		DELETE("/blog/:id", blogController.Delete).
		GET("/blog/user/:userid", blogController.GetAllByUserID)

	router.Run()
}
