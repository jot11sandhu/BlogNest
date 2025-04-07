For back-end : 

# Make sure you have go language installed & My SQL Server already installed locally.

# This is the database connectivity settings (If your local My SQL is ruuning on different port, user, password)
#Make sure to update this field in the .env file to ensure connection.

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=blog
DB_USER=root
DB_PASSWORD=

Go to back-end folder from new terminal
cd back-end

# Run command
go run main.go


For front-end :

# Go to front-end folder from new terminal
cd front-end

# Run 
npm install

# Run 
npm start







