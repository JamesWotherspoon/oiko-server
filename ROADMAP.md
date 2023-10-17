# Roadmap for Smart Saver Server

## Milestone 1: Basic Server Setup
- [x] Initialize project with Node.js
- [x] Create git repo and push to remote origin
- [x] Set up .env, .eslintrc and .gitignore files
- [x] Install necessary dependencies
- [x] Set up basic server with Express.js
- [x] Implement middleware to handle and process req-res object for sharing cross origin api data with client
- [ ] Implement middleware for basic api security
- [x] Implement middleware for info and error logging
- [ ] Implement fallback error handler
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
- [ ] Implement destroy session functionality for logout
- [ ] Implement Google OAuth login Api
- [x] Run unit and integration tests for token generation, cookie issuing and user authentication

## Milestone 4: Transaction Handling
- [x] Define CRUD routes for transaction adhering to RESTful design prinicples
- [x] Create controllers to sucessfully handle basic CRUD operations
- [x] Define transaction validation middleware
- [x] Define accepted query paramaters for getting transactions
- [x] Implpement pagination
- [x] Implement transaction service for database queries with paramaters
- [x] Run Integration tests for CRUD operations with/without queries and user transaction isolation
# 
## Milestone 5: Category Handling
- [ ] Define CRUD routes for category adhering to RESTful design prinicples
- [ ] Create controllers to sucessfully handle basic CRUD operations
- [ ] Define user access to shared categories 
- [ ] Define accepted query paramaters for getting categories
- [ ] Implement handling transaction queries with paramaters
- [ ] Implement category icon images
- [ ] Manage user category preference for improved UX
- [ ] Run Integration tests for CRUD Category operations, user category isolation, shared categories and user preference

## Milestone 6: ScheduledTransaction Handling
- [ ] Define CRUD routes for scheduledTransaction adhering to RESTful design prinicples
- [ ] Create controllers to sucessfully handle basic CRUD operations
- [ ] Define accepted query paramaters for getting scheduledTransaction
- [ ] Implement handling scheduledTransaction queries with paramaters
- [ ] Implement automated scheduledTransaction trigger of transaction considering schedule frequency
- [ ] Run Integration tests for CRUD scheduledTransaction operations, and user scheduledTransaction isolation
- [ ] Run unit and integration tests for running triggering transactions and schedule frequnecy 

## Milestone 7: Determine Operation for FinancialAccounts and SavingGoals
- [ ] Create model for user MoneyPot/financialAccount and SavingsGoals
- [ ] Define technique of handling MoneyPot/financialAccount and SavingsGoal value change
- [ ] Define technique for tracking history of transactions to financialAccounts

## Milestone 8: Request data validation and sanitization
- [ ] Normalize data before inserting to database
- [ ] Hanlde unexpected ASCII or alternative charecters
- [ ] Ensure protection from code and sql injection

## Milestone 9: Code review, and testing
- [ ] Produce API documentation with example request and response objects
- [ ] Ensure consistant import and export usage across server
- [ ] Ensure consistant naming conventions across server
- [ ] Ensure robust and complete error handling
- [ ] Audit dependencies
- [ ] Review all tests

## Milestone 10: Analytics and Monitoring
- [ ] Develop preformance tests and identify bottlenecks
- [ ] Use packages to visualize system health, usage and preformance
- [ ] Setup alerts for system health and security issues

## Complete Frontend roadmap

## Full-stack Milestone x: Deployment
- [ ] Setup and configure Docker
- [ ] Deploy server to production environment
- [ ] Set up continuous integration and deployment with GitHub Actions`;


## Additional 
- [x] Git commit messages
- [x] Git branching - when to branch 
- [x] git lf to crlf line endings 
- [ ] Husky test on main branch

- [ ] Error handling with messages
- [ ] Logging all messages and where to place log
- [ ] Dirrectory and file naming
- [ ] Export & imports standdard