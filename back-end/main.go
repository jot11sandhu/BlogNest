package main

import (
	"api/config"
	"api/router"
)

func main() {
	config.SetupDatabase()
	config.SeedDatabase()
	router.SetupRouter()
}
