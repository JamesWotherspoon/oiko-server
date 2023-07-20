#!/bin/bash

# Pre-deployment script for this react app

# Function to display an error message and exit the script
function error_exit() {
  echo "$1" >&2
  exit 1
}

# Function to run a command and check for errors
function run_command() {
  echo "Running: $1"
  eval "$1"
  status=$?
  if [ $status -ne 0 ]; then
    error_exit "Error executing: $1"
  fi
}

# Uninstall `sass` and install `sass` as a dev dependency
run_command "npm uninstall sass"
run_command "npm install sass --save-dev"

# Install project dependencies
run_command "npm install"

# Build the production version of this React app
run_command "npm run build"

# run_command "npm run optimize"        # Perform asset optimizations
# run_command "npm run security-check"  # Check for known vulnerabilities

echo "Pre-deployment script completed successfully!"
