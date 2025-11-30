# Universal Authentication Module - Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

A beautiful, production-ready authentication frontend built with Next.js 16, React 19, and TypeScript. Features a modern UI with glassmorphism effects, smooth animations, and comprehensive form validation.

---

## ✨ Features

- 🎨 **Modern UI/UX** - Glassmorphism effects, gradient backgrounds, smooth animations
- 🔐 **Dual Authentication** - Email/password and Google OAuth support
- ✅ **Form Validation** - Real-time validation with React Hook Form + Zod
- 🎭 **State Management** - Zustand for global auth state
- 🔄 **API Integration** - React Query for efficient data fetching
- 🛡️ **Protected Routes** - Automatic redirect for unauthenticated users
- 📱 **Responsive Design** - Mobile-first, works on all screen sizes
- ⚡ **Performance** - Next.js 16 App Router with server components
- 🎬 **Animations** - Framer Motion for smooth transitions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- Backend server running (see [server README](../server/Readme.md))

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Environment Setup

Create a `.env` file:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   └── (pages)/
│       ├── auth/              # Authentication pages
│       │   ├── page.tsx       # Login/Signup page
│       │   └── callback/      # OAuth callback handler
│       │       └── page.tsx
│       └── profile/[id]/      # User profile page
│           └── page.tsx
├── components/
│   ├── auth/                  # Auth-related components
│   │   ├── LoginForm.tsx      # Login form component
│   │   └── SignUpForm.tsx     # Registration form component
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── schemas/                   # Zod validation schemas
│   ├── loginSchema.ts
│   └── signupSchema.ts
├── store/                     # Zustand state management
│   └── authStore.ts           # Authentication state
└── utils/                     # Utility functions
    ├── axiosInstance.ts       # Axios configuration
    └── generalServerRequest.ts # API request helpers
```

---

## 🎯 Key Features Explained

### Authentication Flow

#### 1. **Login/Signup Page** (`/auth`)
- Toggle between login and signup modes
- Email/password authentication
- Google OAuth integration
- Real-time form validation
- Error handling with user-friendly messages

#### 2. **OAuth Callback** (`/auth/callback`)
- Handles Google OAuth redirect
- Extracts tokens from URL parameters
- Updates auth state
- Redirects to profile page

#### 3. **Profile Page** (`/profile/[id]`)
- Protected route (requires authentication)
- Displays user information
- Logout functionality
- Beautiful animated UI



### Form Validation

**Zod Schemas** with React Hook Form:
- Email format validation
- Password strength requirements
- Confirm password matching
- Real-time error messages
- Visual feedback (green checkmarks)

### API Integration

**Axios Instance** with:
- Automatic token injection
- Request/response interceptors
- Token refresh on 401 errors
- Public route handling
- Error handling

---


**Features**:
- User avatar (or default icon)
- Welcome message with user name
- Email display
- Member since date
- Logout button
- Animated background effects
- Glassmorphism card design

---

## 🔧 Tech Stack

### Core
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **shadcn/ui** - Component library

### State & Data
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### HTTP & Auth
- **Axios** - HTTP client
- **cookies-next** - Cookie management

---

## 🛡️ Security Features

- ✅ **httpOnly Cookies** - Secure token storage
- ✅ **CSRF Protection** - SameSite cookie attribute
- ✅ **XSS Prevention** - React's built-in sanitization
- ✅ **Input Validation** - Zod schema validation
- ✅ **Protected Routes** - Authentication checks
- ✅ **Token Refresh** - Automatic access token renewal
- ✅ **Secure Headers** - Next.js security headers



---

## 🎨 Design System

### Colors
- **Primary**: Gradient from `#2B4E42` to `#15326C`
- **Background**: Gradient from blue-50 via purple-50 to green-50
- **Success**: Green-500
- **Error**: Red-500

### Typography
- **Font**: System fonts (optimized for performance)
- **Headings**: Bold, gradient text
- **Body**: Regular weight, gray-600

### Effects
- **Glassmorphism**: Backdrop blur with transparency
- **Animations**: Smooth transitions with Framer Motion
- **Shadows**: Layered shadows for depth
- **Gradients**: Multi-color gradients for visual interest

---

## 🔗 API Integration

### Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/google` | GET | Initiate Google OAuth |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/get-profile` | GET | Fetch user profile |

### Request Flow

1. User submits form
2. React Hook Form validates input
3. React Query mutation triggers
4. Axios sends request with auto-injected token
5. Response updates Zustand store
6. UI updates reactively
7. Redirect on success

---

## 🧪 Development

### Code Quality

```bash
# Run linter
npm run lint

# Type checking (automatic with TypeScript)
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000

# Optional (for production)
NEXT_PUBLIC_BASE_API_URL=https://your-api-domain.com
```



### Environment Variables (Production)
Set in Vercel dashboard:
- `NEXT_PUBLIC_BASE_API_URL` - Your production API URL

### Build Optimization
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization
- ✅ Static generation where possible
- ✅ Server-side rendering for dynamic routes

---

## 📚 Key Files

### Configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration

### Core Components
- `src/app/(pages)/auth/page.tsx` - Main auth page
- `src/components/auth/LoginForm.tsx` - Login form
- `src/components/auth/SignUpForm.tsx` - Signup form
- `src/store/authStore.ts` - Auth state management
- `src/utils/axiosInstance.ts` - API client configuration

---

## 🤝 Integration with Backend

This frontend is designed to work with the Universal Authentication Module backend.

**Backend Requirements**:
- CORS enabled for frontend origin
- Endpoints available at `/api/auth/*`
- JWT tokens in response
- Google OAuth configured

**See**: [Backend README](../server/Readme.md)

---

