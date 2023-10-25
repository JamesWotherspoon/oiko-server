# Roadmap for Smart Saver Server

# Version 1.0.0

## Milestone 1: Basic Server Setup
- [x] Initialize project with Node.js
- [x] Create git repo and push to remote origin
- [x] Set up .env, .eslintrc and .gitignore files
- [x] Install necessary dependencies
- [x] Set up basic server with Express.js
- [x] Implement middleware to handle and process req-res object for sharing cross origin api data with client
- [ ] Implement middleware for basic api security
- [x] Implement middleware for info and error logging
- [x] Implement fallback error handler
- [x] Run integration tests for server and unit tests for middleware

## Milestone 2: Database Setup
- [x] Connect server to MySQL database with Sequelize
- [x] Define models and interactions for User, Transaction, Category and ScheduleTransaction
- [x] Create initializeDatabase file

## Milestone 3: User Authentication
- [x] Implement user authentication cookie generation
- [x] Authentication middleware to validate cookie and parse user id
- [x] Create user creation route for registration - with password hashing and email normilaztion
- [x] Generate authentication session for login
- [x] Run unit and integration tests for token generation, cookie issuing and user authentication

## Milestone 4: Transaction Handling
- [x] Define CRUD routes for transaction adhering to RESTful design prinicples
- [x] Create controllers to sucessfully handle basic CRUD operations
- [x] Define transaction validation middleware and sanitization
- [x] Define accepted query paramaters for getting transactions
- [x] Implpement pagination
- [x] Implement transaction service for database queries with paramaters
- [x] Run Integration tests for CRUD operations with/without queries and user transaction isolation
# 
## Milestone 5: Category Handling
- [x] Define CRUD routes for category adhering to RESTful design prinicples
- [x] Create controllers to sucessfully handle basic CRUD operations
- [x] Define accepted query paramaters for getting categories
- [x] Implement handling transaction queries with paramaters
- [x] Run Integration tests for CRUD Category operations

## Milestone 6: ScheduledTransaction Handling
- [x] Define CRUD routes for scheduledTransaction adhering to RESTful design prinicples
- [x] Create controllers to sucessfully handle basic CRUD operations
- [x] Define accepted query paramaters for getting scheduledTransaction
- [x] Implement handling scheduledTransaction queries with paramaters
- [x] Implement automated scheduledTransaction trigger of transaction considering schedule frequency
- [x] Run Integration tests for CRUD scheduledTransaction operations
- [x] Run unit and integration tests for running triggering transactions and schedule frequnecy 

## Milestone 7: MoneyPots
- [x] Create model for user MoneyPot
- [x] Create MoneyPot routes and controller
- [x] Creat ApiSchema 
- [x] Create MoneyPot services 
- [x] Create MoneyPot transaction service to ensure income/expense both executed successfully
- [x] Integration tests for moneyPot CRUD operations, test for moneyPot transfers, test transaction CRUD operations update moneyPot balance

## Milestone 8: Code review, and testing
- [ ] Review all code for points of concern -> list concern in ROADMAP -> Refactor for clairty and effciency
- [ ] Evaluate layers for consistant appraoches
- [ ] Ensure consistant import and export usage across server
- [ ] Ensure consistant naming conventions across server
- [ ] Ensure robust and complete error handling and effective error messages
- [ ] Produce API documentation with example request and response objects
- [ ] Audit dependencies
- [ ] Review all tests
### Concerns Identified
- [ ] Session and user

## Milestone 9: Analytics and Monitoring
- [ ] Develop preformance tests and identify bottlenecks - timings
- [ ] Use packages to visualize system health, usage and preformance
- [ ] Setup alerts for system health and security issues

## Complete Frontend roadmap

## Full-stack Milestone x: Deployment
- [ ] Setup and configure Docker
- [ ] Deploy server to production environment
- [ ] Set up continuous integration and deployment with GitHub Actions
- [ ] Get SLS certificate and ensure https is used
- [ ] Ensure robust firewall for virtual machine

# Version 1.1.0

## Preformance
- [ ] Implement http2.0

## Authentication
- [ ] Implement Google OAuth login Api
- [ ] apply login limits - timeout

## Secuirty
- [ ] Apply secuirty logging
- [ ] apply reffer header checks with logging
- [ ] Apply more robust authorization to check user can only access there own data

## Data Display
- [ ] Calculate transactions for frontend visualization

## Categories
- [ ] Apply default caetgories on user creation
- [ ] Implement category icon images
- [ ] Manage user category preference for improved UX