# Integration Guide - Universal Authentication Module

This guide shows how to integrate the authentication module into any Express.js project **without modifying the module itself**.

---

## 📦 Option 1: NPM Package (Recommended for Production)

### Step 1: Prepare the Module for Publishing

Create `package.json` in the server directory with proper exports:

```json
{
  "name": "@yourcompany/universal-auth-module",
  "version": "1.0.0",
  "description": "Production-ready authentication module with email/password and Google OAuth",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "prisma"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["authentication", "jwt", "oauth", "express", "prisma"],
  "peerDependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^7.0.0"
  }
}
```

### Step 2: Create Main Export File

Create `server/index.ts`:

```typescript
// Export all routes
export { default as authRoutes } from './routes/auth.routes';

// Export middleware
export { authenticateToken } from './middlewares/authMiddleware';
export { validate } from './middlewares/validationMiddleware';

// Export controllers (if needed)
export * from './controllers/auth.controller';

// Export utilities
export * from './utils/tokensUtils';
export * from './utils/helpers';

// Export types
export * from './Types/types';

// Export Prisma client setup
export { prisma } from './prisma/client';
```

### Step 3: Publish to NPM

```bash
# Login to npm
npm login

# Publish
npm publish --access public
```

### Step 4: Use in Any Project

```bash
# Install in your project
npm install @yourcompany/universal-auth-module
```

**In your Express app:**

```typescript
import express from 'express';
import { authRoutes, authenticateToken } from '@yourcompany/universal-auth-module';

const app = express();

// Use authentication routes
app.use('/api/auth', authRoutes);

// Protect your routes
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', userId: req.userId });
});

app.listen(5000);
```

---

## 📁 Option 2: Git Submodule (For Internal Projects)

### Step 1: Add as Submodule

```bash
# In your project root
git submodule add https://github.com/yourcompany/auth-module.git modules/auth
```

### Step 2: Install Dependencies

```bash
cd modules/auth/server
npm install
```

### Step 3: Use in Your Project

**In your Express app:**

```typescript
import express from 'express';
import authRoutes from './modules/auth/server/routes/auth.routes';
import { authenticateToken } from './modules/auth/server/middlewares/authMiddleware';

const app = express();

// Use authentication routes
app.use('/api/auth', authRoutes);

// Protect your routes
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', userId: req.userId });
});

app.listen(5000);
```

---

## 🔧 Option 3: Local Package (For Development)

### Step 1: Link Locally

```bash
# In the auth module directory
cd server
npm link

# In your project directory
npm link @yourcompany/universal-auth-module
```

### Step 2: Use Same as NPM Package

```typescript
import { authRoutes, authenticateToken } from '@yourcompany/universal-auth-module';
```

---

## ⚙️ Configuration (All Options)

### Environment Variables

Create `.env` in your project:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_db

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Prisma Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

---

## 🎯 Complete Integration Example

### Your Project Structure

```
your-project/
├── src/
│   ├── index.ts          # Your main app
│   └── routes/
│       └── users.ts      # Your custom routes
├── node_modules/
│   └── @yourcompany/
│       └── universal-auth-module/
├── .env
└── package.json
```

### Your `src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes, authenticateToken, setupPassport } from '@yourcompany/universal-auth-module';
import userRoutes from './routes/users';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Setup Passport for Google OAuth
setupPassport(app);

// Authentication routes (from module)
app.use('/api/auth', authRoutes);

// Your custom routes (protected)
app.use('/api/users', authenticateToken, userRoutes);

// Your other routes...

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### Your Custom Protected Route

```typescript
// src/routes/users.ts
import { Router } from 'express';
import type { AuthRequest } from '@yourcompany/universal-auth-module';

const router = Router();

// This route is automatically protected because
// authenticateToken middleware is applied at app level
router.get('/profile', async (req: AuthRequest, res) => {
  const userId = req.userId; // Injected by authenticateToken
  
  // Your custom logic
  const userData = await getUserData(userId);
  res.json(userData);
});

export default router;
```

---

## 🔐 Using the Auth Middleware

### Protect Individual Routes

```typescript
import { authenticateToken } from '@yourcompany/universal-auth-module';

app.get('/api/protected', authenticateToken, (req, res) => {
  // req.userId is available here
  res.json({ userId: req.userId });
});
```

### Protect Route Groups

```typescript
import { authenticateToken } from '@yourcompany/universal-auth-module';

// All routes under /api/admin require authentication
app.use('/api/admin', authenticateToken, adminRoutes);
```

### Optional Authentication

```typescript
import { verifyAccessToken } from '@yourcompany/universal-auth-module';

app.get('/api/optional-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const { userId } = verifyAccessToken(token);
      // User is authenticated
      return res.json({ userId, premium: true });
    } catch {
      // Token invalid, continue as guest
    }
  }
  
  // Guest access
  res.json({ premium: false });
});
```

---

## 🎨 Frontend Integration

### Install Client Package (if published separately)

```bash
npm install @yourcompany/universal-auth-client
```

### Or Copy Components

Copy these directories to your Next.js project:
- `client/src/components/auth/`
- `client/src/store/authStore.ts`
- `client/src/utils/axiosInstance.ts`
- `client/src/schemas/`

### Use in Your App

```typescript
import { LoginForm, SignUpForm } from '@yourcompany/universal-auth-client';
import { useAuthStore } from '@yourcompany/universal-auth-client';

function AuthPage() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  
  return <LoginForm onSwitchToSignup={() => {}} />;
}
```

---

## 📋 Checklist for Integration

- [ ] Install the module (npm, git submodule, or local link)
- [ ] Configure environment variables
- [ ] Setup database connection
- [ ] Run Prisma migrations
- [ ] Import and mount auth routes
- [ ] Setup Passport for Google OAuth
- [ ] Apply authenticateToken middleware to protected routes
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test Google OAuth flow
- [ ] Test token refresh
- [ ] Test logout
- [ ] Test protected routes

---

## 🚨 Common Issues

### Issue: Prisma Client Not Found

**Solution**: Run `npx prisma generate` in your project

### Issue: Database Connection Failed

**Solution**: Check `DATABASE_URL` in `.env` matches your database

### Issue: Google OAuth Not Working

**Solution**: Verify redirect URI in Google Cloud Console matches `${BACKEND_URL}/api/auth/google/callback`

### Issue: CORS Errors

**Solution**: Add your frontend URL to CORS configuration:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 🎯 Best Practices

1. **Don't Modify the Module**: All customization via environment variables
2. **Use TypeScript**: Import types from the module for type safety
3. **Separate Concerns**: Keep your business logic separate from auth logic
4. **Version Control**: Pin module version in package.json
5. **Environment Specific**: Use different .env files for dev/staging/prod
6. **Monitor Tokens**: Implement token refresh on frontend
7. **Error Handling**: Catch auth errors and redirect appropriately

---

## 📚 Additional Resources

- [Server API Documentation](./Readme.md)
- [Swagger Docs](http://localhost:5000/api-docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js Documentation](http://www.passportjs.org/docs/)

---

**Need Help?** Check the main README or review the example integration in the demo project.
