# Backend-Ledger
A Node.js backend for a simple ledger/accounting system with user authentication, account management, and transaction tracking.

## Features
- User registration, login, and logout (JWT-based authentication)
- Account creation and balance retrieval
- Secure transaction processing between accounts
- Email notifications for registration and transactions
- Token blacklist for secure logout

## Tech Stack
- Node.js, Express.js
- MongoDB, Mongoose
- JWT for authentication
- Nodemailer for email
- dotenv for environment variables

## Folder Structure
```
src/
  app.js                # Express app setup
  server.js             # Entry point
  config/db.js          # MongoDB connection
  controllers/          # Route controllers
  middleware/           # Auth middleware
  models/               # Mongoose models
  routes/               # Express routes
  services/email.service.js # Email sending logic
.env                    # Environment variables
```

## Setup Instructions
1. **Clone the repository**
2. **Install dependencies**
	```bash
	npm install
	```
3. **Configure environment variables**
	- Copy `src/.env` and fill in:
	  - `MONGO_URI`, `JWT_SECRET`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `EMAIL_USER`
4. **Run the server**
	```bash
	npm run dev
	```
	or
	```bash
	npm start
	```

## API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/accounts/` - Create account
- `GET /api/accounts/` - Get user accounts
- `GET /api/accounts/balance/:accountId` - Get account balance
- `POST /api/transaction/` - Create transaction
- `POST /api/transaction/system/initial-funds` - System initial funds (admin)

## Notes
- Requires MongoDB running and valid email credentials for notifications.
- All sensitive data should be stored in `.env` and never committed to version control.

## License
MIT
# Backend-Ledger
