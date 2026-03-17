# CapitaPrimellc Backend API

A Node.js backend API for CapitaPrimellc application, deployed on Render.

## Base URL
```
https://your-render-app-name.onrender.com
```

## Authentication
This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check Endpoints

#### 1. Root Endpoint
- **Endpoint**: `GET /`
- **Description**: Returns basic API information and status
- **JWT Required**: No
- **Request Body**: None
- **Response**:
```json
{
  "success": true,
  "message": "CapitaPrimellc Backend API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

#### 2. Health Check
- **Endpoint**: `GET /health`
- **Description**: Comprehensive health check including Firebase and database status
- **JWT Required**: No
- **Request Body**: None
- **Response**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "memory": {
    "rss": 12345678,
    "heapTotal": 1234567,
    "heapUsed": 123456,
    "external": 12345
  },
  "services": {
    "firebase": "healthy",
    "database": "healthy"
  },
  "environment": {
    "node_version": "v18.17.0",
    "platform": "linux",
    "environment": "production"
  }
}
```

### Admin Endpoints

#### 3. Admin Login
- **Endpoint**: `POST /api/admin/login`
- **Description**: Authenticate admin user and return JWT token
- **JWT Required**: No
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```
- **Response (Success)**:
```json
{
  "success": true,
  "status": "success",
  "description": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```
- **Response (Error)**:
```json
{
  "success": false,
  "status": "unauthorized",
  "description": "Invalid credentials"
}
```

#### 4. Get Admin Profile
- **Endpoint**: `GET /api/admin/profile`
- **Description**: Get authenticated admin user's profile information
- **JWT Required**: Yes
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "data": {
    "email": "admin@example.com",
    "role": "admin",
    "type": "admin"
  }
}
```
- **Response (Error - Unauthorized)**:
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "jwt malformed"
}
```

### Theme Management Endpoints

#### 5. Get Current Theme
- **Endpoint**: `GET /api/admin/theme`
- **Description**: Get the currently active theme configuration
- **JWT Required**: Yes
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "data": {
    "primary": "#C9A84C",
    "secondary": "#0a0a0a",
    "accent": "#ffffff",
    "mode": "dark",
    "name": "default",
    "active": true
  }
}
```

#### 6. Update Current Theme
- **Endpoint**: `PUT /api/admin/theme`
- **Description**: Update the active theme configuration
- **JWT Required**: Yes
- **Request Body**:
```json
{
  "primary": "#C9A84C",
  "secondary": "#0a0a0a",
  "accent": "#ffffff",
  "mode": "dark"
}
```
- **Response (Success)**:
```json
{
  "success": true,
  "message": "Theme updated successfully",
  "data": {
    "primary": "#C9A84C",
    "secondary": "#0a0a0a",
    "accent": "#ffffff",
    "mode": "dark",
    "active": true
  }
}
```

#### 7. Get All Themes
- **Endpoint**: `GET /api/admin/themes`
- **Description**: Get all theme configurations including presets
- **JWT Required**: Yes
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "theme_id_1",
      "primary": "#C9A84C",
      "secondary": "#0a0a0a",
      "accent": "#ffffff",
      "mode": "dark",
      "name": "default",
      "active": true
    }
  ]
}
```

#### 8. Create Theme Preset
- **Endpoint**: `POST /api/admin/themes`
- **Description**: Create a new theme preset
- **JWT Required**: Yes
- **Request Body**:
```json
{
  "primary": "#FF6B6B",
  "secondary": "#1a1a1a",
  "accent": "#ffffff",
  "mode": "dark",
  "name": "Red Theme"
}
```
- **Response (Success)**:
```json
{
  "success": true,
  "message": "Theme preset created successfully",
  "data": {
    "id": "new_theme_id",
    "primary": "#FF6B6B",
    "secondary": "#1a1a1a",
    "accent": "#ffffff",
    "mode": "dark",
    "name": "Red Theme",
    "active": false
  }
}
```

#### 9. Activate Theme
- **Endpoint**: `PUT /api/admin/themes/:themeId/activate`
- **Description**: Activate a specific theme configuration
- **JWT Required**: Yes
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "message": "Theme activated successfully",
  "data": {
    "id": "theme_id",
    "primary": "#C9A84C",
    "secondary": "#0a0a0a",
    "accent": "#ffffff",
    "mode": "dark",
    "active": true
  }
}
```

## Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "status": "error|unauthorized",
  "description": "Error description message",
  "error": "Detailed error (only in development)"
}
```

## Environment Variables
The following environment variables are required:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time (default: 24h)
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID`: Firebase private key ID
- `FIREBASE_PRIVATE_KEY`: Firebase private key (with \n replaced)
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_CLIENT_ID`: Firebase client ID
- `FIREBASE_AUTH_URI`: Firebase auth URI
- `FIREBASE_TOKEN_URI`: Firebase token URI
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`: Firebase auth provider cert URL
- `FIREBASE_CLIENT_X509_CERT_URL`: Firebase client cert URL

## Deployment on Render
This backend is configured for deployment on Render:

1. **Build Command**: `pnpm install --frozen-lockfile; pnpm run build`
2. **Start Command**: `pnpm run dev`
3. **Environment**: Set all required environment variables in Render dashboard
4. **Node Version**: 18.x or higher recommended

## Development Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create `.env` file with required environment variables
4. Start development server: `pnpm run dev`
5. Server will run on `http://localhost:3000`

## Theme Management System

The application includes a comprehensive theme management system that allows administrators to customize the site's color scheme through the admin panel.

### Features
- **Dynamic Color Customization**: Primary, secondary, and accent colors
- **Dark/Light Mode Support**: Toggle between interface modes
- **Real-time Updates**: Changes apply immediately across the site
- **Persistent Storage**: Themes saved to Firebase Firestore
- **Default Theme**: Gold (#C9A84C), Dark (#0a0a0a), White (#ffffff)

### Theme Structure
```json
{
  "primary": "#C9A84C",
  "secondary": "#0a0a0a",
  "accent": "#ffffff",
  "mode": "dark",
  "name": "default"
}
```

### Frontend Integration
- **ThemeContext**: Global theme state management
- **CSS Custom Properties**: Dynamic color application
- **Component Updates**: Real-time theme color application
- **Admin Panel**: Theme customization interface

## Technologies Used
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Firebase Admin SDK**: Database and authentication
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation
- Firebase service account authentication