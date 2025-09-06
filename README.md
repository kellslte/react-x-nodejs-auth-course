# React Authentication Course

A full-stack authentication system built with React (Vite) frontend and NestJS backend, featuring comprehensive user management, JWT authentication, email verification, and password reset functionality.

## 🚀 Features

### Authentication & Authorization
- **User Registration** with email verification
- **Login/Logout** with JWT tokens
- **Password Reset** via email
- **Email Verification** system
- **Cookie-based Authentication** for enhanced security
- **JWT Access & Refresh Tokens**
- **Protected Routes** with guards

### Security Features
- **Password Hashing** with bcryptjs
- **Input Validation** with class-validator
- **Custom Validation Decorators** (@IsEqualTo)
- **CORS Configuration**
- **Helmet Security Headers**
- **Rate Limiting** (configurable)

### Email System
- **Email Templates** with Handlebars
- **Mailtrap Integration** for development
- **Welcome Emails**
- **Password Reset Emails**
- **Email Verification**

### Database
- **MongoDB** with Mongoose ODM
- **User Schema** with validation
- **Database Connection Management**
- **Environment-based Configuration**

## 🏗️ Project Structure

```
react-x-nodejs/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication module
│   │   │   └── users/      # User management module
│   │   ├── shared/         # Shared utilities
│   │   │   ├── decorators/ # Custom decorators
│   │   │   ├── filters/    # Exception filters
│   │   │   ├── interceptors/ # Request/Response interceptors
│   │   │   ├── services/   # Shared services
│   │   │   └── types/      # TypeScript types
│   │   └── main.ts         # Application entry point
│   └── package.json
├── web/                    # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── package.json            # Root package.json (Yarn Workspaces)
```

## 🛠️ Tech Stack

### Backend (API)
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens
- **Passport** - Authentication middleware
- **Class Validator** - Validation decorators
- **Zod** - Schema validation
- **Nodemailer** - Email sending
- **Handlebars** - Email templates

### Frontend (Web)
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

### Development Tools
- **Yarn Workspaces** - Monorepo management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** (v1.22.22)
- **MongoDB** (local or cloud instance)
- **Mailtrap Account** (for email testing)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-x-nodejs
```

### 2. Install Dependencies

```bash
# Install all dependencies for both workspaces
yarn install

# Or install individually
yarn workspace api install
yarn workspace web install
```

### 3. Environment Setup

Create environment files for the API:

```bash
# Create .env file in api directory
cd api
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/react_auth_course
MONGODB_DATABASE_NAME=react_auth_course

# JWT
JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-that-is-at-least-32-characters-long
JWT_REFRESH_EXPIRES_IN=7d

# Email (Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM=no-reply@yourapp.com
MAIL_NAME=Your App Name

# Application
PORT=32190
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:32190/api/v1

# Cookies
COOKIE_SECRET=your-super-secret-cookie-key-that-is-at-least-32-characters-long
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=localhost
```

### 4. Start the Development Servers

```bash
# Start both API and Web servers
yarn start:dev

# Or start individually
yarn api:dev    # Starts API on port 32190
yarn web:dev    # Starts Web on port 5173
```

### 5. Access the Application

- **API**: http://localhost:32190
- **Web**: http://localhost:5173
- **API Health Check**: http://localhost:32190/health

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/v1/auth/register` | Register new user | None |
| POST | `/api/v1/auth/login` | Login user | None |
| POST | `/api/v1/auth/logout` | Logout user | None |
| GET | `/api/v1/auth/me` | Get user profile | Cookie-based |
| POST | `/api/v1/auth/refresh-token` | Refresh access token | None |
| POST | `/api/v1/auth/forgot-password` | Send password reset email | None |
| POST | `/api/v1/auth/reset-password/:token` | Reset password | None |
| GET | `/api/v1/auth/verify-email/:token` | Verify email address | None |

### User Management Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/v1/users` | Get all users | Required |
| GET | `/api/v1/users/:id` | Get user by ID | Required |
| PUT | `/api/v1/users/:id` | Update user | Required |
| DELETE | `/api/v1/users/:id` | Delete user | Required |
| POST | `/api/v1/users/change-password` | Change password | Required |

### Request/Response Examples

#### Register User
```bash
curl -X POST http://localhost:32190/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:32190/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get User Profile (with cookies)
```bash
curl -X GET http://localhost:32190/api/v1/auth/me \
  -b cookies.txt
```

## 🔧 Custom Validation Decorators

### @IsEqualTo Decorator

A custom validation decorator that ensures one field equals another field.

```typescript
import { IsEqualTo } from './shared/decorators/is-equal-to.decorator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @IsEqualTo('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
```

## 🧪 Testing

```bash
# Run API tests
yarn workspace api test

# Run API e2e tests
yarn workspace api test:e2e

# Run Web tests
yarn workspace web test
```

## 🏗️ Building for Production

```bash
# Build all workspaces
yarn build

# Build individually
yarn workspace api build
yarn workspace web build

# Start production servers
yarn start:prod
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication
- **Cookie Security**: HttpOnly, Secure, SameSite cookies
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Built-in rate limiting capabilities
- **Email Verification**: Required email verification for new accounts

## 📧 Email Templates

The application includes Handlebars templates for:
- **Welcome Email** - Sent after successful registration
- **Email Verification** - Sent for email verification
- **Password Reset** - Sent when requesting password reset
- **Password Reset Success** - Sent after successful password reset

## 🚀 Deployment

### Environment Variables for Production

Ensure to set the following production environment variables:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
MAIL_HOST=your-production-smtp-host
MAIL_USER=your-production-email-username
MAIL_PASSWORD=your-production-email-password
COOKIE_SECURE=true
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Favour Max-Oti**

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the UI library
- MongoDB team for the database
- All contributors and open source libraries used

---

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainer

Happy coding! 🚀
