#!/bin/bash

echo "Script started"

# Load environment variables from .env file
if [[ -f .env ]]; then
  source .env
else
  echo "Error: .env file not found."
  exit 1
fi

# Check if the database exists
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "USE $DB_NAME;" 2>/dev/null; then
  echo "Database already exists."
else
  # Create the database if it doesn't exist
  if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "CREATE DATABASE $DB_NAME;"; then
    # Use the database
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "USE $DB_NAME;"
    echo "Database created successfully."
  else
    echo "Error creating the database."
    exit 1
  fi
fi

# Check if the 'user' table exists
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SHOW TABLES LIKE 'user';" | grep -q "user"; then
  echo "Table 'user' already exists."
else
  # Define SQL statement to create the 'user' table
  create_user_table_sql="CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );"

  # Execute SQL statement to create the 'user' table
  if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "$create_user_table_sql"; then
    echo "Table 'user' created successfully."
  else
    echo "Error creating the 'user' table."
    exit 1
  fi
fi
