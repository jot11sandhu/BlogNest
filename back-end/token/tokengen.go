package token

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var secretKey = []byte("my-sceret-key")

type Claims struct {
	Email  string
	Userid int
	jwt.RegisteredClaims
}

func GenerateToken(email string, userid int) (string, error) {
	claims := &Claims{
		Email:  email,
		Userid: userid,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "myapi",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func ParseToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
