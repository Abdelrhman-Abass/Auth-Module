# Universal Authentication Module

A production-ready, plug-and-play authentication system for modern web applications. Built with security, reusability, and developer experience in mind.

## 🎯 Overview

This module provides a complete authentication solution that can be easily integrated into any backend project. It supports both traditional email/password authentication and social authentication (Google OAuth), with a beautiful demo frontend to showcase the functionality.

## ✨ Key Features

- 🔐 **Email/Password Authentication** - Secure user registration and login
- 🌐 **Google OAuth 2.0** - Social authentication integration
- 🎫 **JWT Token System** - Access tokens (60min) + Refresh tokens (30 days)
- 🔄 **Token Refresh** - Automatic session renewal without re-login
- 🛡️ **Security First** - bcrypt hashing, httpOnly cookies, CORS protection
- 🎨 **Beautiful UI** - Modern, responsive demo frontend with glassmorphism effects
- 📦 **Plug & Play** - Easy integration with minimal configuration
- 📚 **Well Documented** - Comprehensive guides and API documentation

## 🏗️ Architecture

```
Auth-Module/
├── server/          # Backend authentication API
│   ├── controllers/ # Authentication logic
│   ├── routes/      # API endpoints
│   ├── middlewares/ # Auth middleware & validation
│   ├── utils/       # Token management & helpers
│   └── prisma/      # Database schema & client
│
└── client/          # Frontend demo application
    ├── app/         # Next.js pages (auth, profile)
    ├── components/  # UI components (forms, etc.)
    ├── store/       # State management (Zustand)
    └── utils/       # API client & helpers
```

## 🚀 Quick Start

### Backend Setup

```bash
cd server
npm install
npm run prisma:migrate
npm run dev
```

**See**: [Server README](./server/Readme.md) for detailed setup

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

**See**: [Client README](./client/README.md) for detailed setup

## 📋 What's Included

### Backend (Express + Prisma + PostgreSQL)
- ✅ User registration & login endpoints
- ✅ Google OAuth integration with Passport.js
- ✅ JWT access & refresh token generation
- ✅ Token refresh mechanism
- ✅ Protected route middleware
- ✅ Rate limiting & input validation
- ✅ Swagger API documentation
- ✅ Error handling & logging

### Frontend (Next.js 16 + React 19 + TypeScript)
- ✅ Login & signup forms with validation
- ✅ Google OAuth button
- ✅ User profile page
- ✅ Protected routes
- ✅ State management with Zustand
- ✅ API integration with React Query
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Separate secrets for access/refresh tokens
- **Token Storage**: httpOnly cookies for refresh tokens
- **Token Rotation**: Refresh tokens invalidated after use
- **CORS Protection**: Configured allowed origins
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Zod schemas on all endpoints
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📖 Documentation

- **[Server Documentation](./server/Readme.md)** - Backend API setup and usage
- **[Client Documentation](./client/README.md)** - Frontend setup and features
- **[Verification Walkthrough](./walkthrough.md)** - Complete feature verification
- **API Docs**: Available at `http://localhost:5000/api-docs` when server is running

## 🎯 Use Cases

Perfect for:
- 🚀 Startups needing quick authentication setup
- 🏢 Enterprise applications requiring secure auth
- 📱 Mobile apps with web backend
- 🎓 Learning authentication best practices
- 🔧 Microservices architecture

## 🛠️ Tech Stack

**Backend**:
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport.js (Google OAuth)
- JWT

**Frontend**:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- React Query

## 📝 Requirements

- Node.js 20+
- PostgreSQL database
- Google OAuth credentials (for social auth)

## 🤝 Integration

This module is designed to be reusable. To integrate into your project:

1. **Install the module** in your backend
2. **Configure environment variables** (database, secrets, OAuth keys)
3. **Import and use** the authentication routes
4. **Protect your routes** with the provided middleware

See the [Server README](./server/Readme.md) for detailed integration steps.


---

**Built with ❤️ for developers who value security and simplicity**