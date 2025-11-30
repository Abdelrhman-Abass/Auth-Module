# Universal Authentication Module Server Side   
Production-ready authentication API built with Express, Prisma, PostgreSQL, and functional programming principles.

![Node.js](https://img.shields.io/badge/node-%3E%3D%2022.12-brightgreen)  
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)  
![Prisma](https://img.shields.io/badge/Prisma-7+-purple)  
![JWT + httpOnly Refresh](https://img.shields.io/badge/JWT%20%2B%20httpOnly%20Refresh-secure-success)  
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-2.0-blue)


## 🌟 Features

- ✅ **Email/Password Authentication** - Secure user registration and login
- ✅ **Google OAuth 2.0** - Social authentication integration
- ✅ **JWT Tokens** - Access tokens (15min) + Refresh tokens (7 days)
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **Functional Architecture** - Clean, testable, maintainable code
- ✅ **Security First** - bcrypt hashing, httpOnly cookies, CORS protection
- ✅ **Token Rotation** - Automatic refresh token rotation
- ✅ **TypeScript** - Full type safety
- ✅ **Clean Architecture** - Separated layers (Core, Infrastructure, Presentation)


## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# JWT Secrets (generate with: openssl rand -base64 32)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=123456789-xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxx

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```
### API Endpoints

| Method | Endpoint                     | Description                                   | Auth Required     |
|--------|------------------------------|-----------------------------------------------|-------------------|
| POST   | `/api/auth/register`         | Register with name, email, password           | No                |
| POST   | `/api/auth/login`            | Login with email + password                   | No                |
| GET    | `/api/auth/google`           | Start Google OAuth flow                       | No                |
| GET    | `/api/auth/google/callback`  | Google callback → issues tokens & redirects   | No                |
| POST   | `/api/auth/refresh`          | Get new access token (reads httpOnly cookie)  | Refresh token     |
| POST   | `/api/auth/logout`           | Invalidate refresh token + clear cookie       | No                |
| GET    | `/api/auth/get-profile`               | Get current user profile                      | Access token      |

**Swagger UI:** `http://localhost:5000/api-docs`

---

### Security Best Practices (All Implemented)

- Refresh token rotation on every use
- Refresh tokens stored in DB with expiration
- httpOnly, Secure (in production), SameSite=Lax cookies
- Separate JWT secrets for access & refresh
- Passwords never returned (`formatUserResponse` strips `passwordHash`)
- Zod validation + rate limiting on all auth routes
- Proper error handling with `AppError`
- No debug logs in production

---
