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
- **JWT Required**: No (Public endpoint - anyone can view current theme)
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
- **JWT Required**: Yes (Admin authentication required)
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
- **JWT Required**: Yes (Admin authentication required)
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
- **JWT Required**: Yes (Admin authentication required)
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
- **JWT Required**: Yes (Admin authentication required)
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

### Asset Management Endpoints

#### 10. Get All Assets
- **Endpoint**: `GET /api/assets`
- **Description**: Get all assets (public access for listings)
- **JWT Required**: No
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "asset_id_1",
      "name": "Palm Jumeirah Villa",
      "type": "Property",
      "quantity": 1,
      "location": "Palm Jumeirah, Dubai",
      "description": "Luxurious beachfront villa with stunning sea views",
      "imageUrls": ["/uploads/image1.jpg", "/uploads/image2.jpg", "/uploads/image3.jpg"],
      // Property-specific fields
      "price": 15000000,
      "area": 8500,
      "bedrooms": 5,
      "bathrooms": 6,
      "parking": 3,
      "yearBuilt": 2020,
      "propertyType": "Villa",
      "listingType": "Sale",
      // Coordinates
      "coordinates": {
        "latitude": 25.123456,
        "longitude": 55.123456
      },
      // Additional details
      "amenities": ["Swimming Pool", "Gym", "Beach Access", "Concierge"],
      "features": ["Sea View", "Private Beach", "Smart Home", "Furnished"],
      "neighborhood": "Palm Jumeirah",
      "developer": "Nakheel",
      "completionStatus": "Ready",
      "paymentPlan": "20% down payment, 80% mortgage",
      // Contact info
      "agentName": "Ahmed Al-Rashid",
      "agentPhone": "+971501234567",
      "agentEmail": "ahmed@capitaprimellc.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 11. Get Single Asset
- **Endpoint**: `GET /api/assets/:id`
- **Description**: Get a specific asset by ID
- **JWT Required**: No
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "asset_id_1",
    "name": "Office Desk",
    "type": "Furniture",
    "quantity": 5,
    "location": "Dubai Office",
    "description": "Modern office desk",
    "imageUrls": ["/uploads/image1.jpg", "/uploads/image2.jpg"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 12. Create Asset
- **Endpoint**: `POST /api/assets`
- **Description**: Create a new asset with up to 7 images
- **JWT Required**: Yes (Admin authentication required)
- **Request Body**: FormData with the following fields:
  - `name` (string, required): Asset/property name
  - `type` (string, required): Asset type (Equipment, Furniture, Vehicle, Property, Other)
  - `quantity` (number): Asset quantity (default: 0)
  - `location` (string): Asset/property location
  - `description` (string): Asset/property description
  - `images` (files, optional): Up to 7 image files (JPEG, PNG, WEBP, GIF, max 5MB each)
  - `price` (number): Property price in AED
  - `area` (number): Property area in square feet
  - `bedrooms` (number): Number of bedrooms
  - `bathrooms` (number): Number of bathrooms
  - `parking` (number): Number of parking spaces
  - `yearBuilt` (number): Year the property was built
  - `propertyType` (string): Type of property (Apartment, Villa, Townhouse, etc.)
  - `listingType` (string): Sale, Rent, or Lease
  - `latitude` (number): GPS latitude coordinate
  - `longitude` (number): GPS longitude coordinate
  - `amenities` (string): Comma-separated list of amenities
  - `features` (string): Comma-separated list of features
  - `neighborhood` (string): Neighborhood name
  - `developer` (string): Property developer name
  - `completionStatus` (string): Ready, Off-Plan, or Under Construction
  - `paymentPlan` (string): Payment plan details
  - `agentName` (string): Agent contact name
  - `agentPhone` (string): Agent phone number
  - `agentEmail` (string): Agent email address
- **Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "new_asset_id",
    "name": "Office Desk",
    "type": "Furniture",
    "quantity": 5,
    "location": "Dubai Office",
    "description": "Modern office desk",
    "imageUrls": ["/uploads/image1.jpg", "/uploads/image2.jpg"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 13. Update Asset
- **Endpoint**: `PUT /api/assets/:id`
- **Description**: Update an existing asset, can add additional images (up to 7 total)
- **JWT Required**: Yes (Admin authentication required)
- **Request Body**: FormData with the same fields as create (only changed fields need to be provided)
- **Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "asset_id_1",
    "name": "Updated Office Desk",
    "type": "Furniture",
    "quantity": 3,
    "location": "Dubai Office",
    "description": "Updated modern office desk",
    "imageUrls": ["/uploads/image1.jpg", "/uploads/image2.jpg", "/uploads/image3.jpg"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### 14. Delete Asset
- **Endpoint**: `DELETE /api/assets/:id`
- **Description**: Delete an asset and all its associated images
- **JWT Required**: Yes (Admin authentication required)
- **Request Body**: None
- **Response (Success)**:
```json
{
  "success": true,
  "message": "Asset deleted successfully"
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

### Stripe (payments)
Set these in **Render → Environment** (never commit real keys to git).

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | **Secret** API key only: must start with `sk_test_` (test) or `sk_live_` (production). **Do not** put the publishable key (`pk_…`) here — Checkout will fail with `secret_key_required`. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from Stripe Dashboard → Webhooks (`whsec_…`). Not the API secret. |
| `STRIPE_PRICE_ID` | Optional: `price_…` for fixed “site confirmation” checkout only. |
| `FRONTEND_BASE_URL` | Public site origin for Checkout success/cancel URLs, e.g. `https://yourdomain.com` |

### Email (inquiry notifications)
Gmail (recommended) uses an [App Password](https://myaccount.google.com/apppasswords), not your normal login password.

| Variable | Description |
|----------|-------------|
| `GMAIL_USER` | Full Gmail address used to send mail |
| `GMAIL_APP_PASSWORD` | 16-character app password |
| `INQUIRY_NOTIFY_EMAIL` | Optional inbox to receive inquiry copies (defaults to a project address if unset) |
| `SMTP_PREFER_IPV4` | Default `true`. On Render, resolving `smtp.gmail.com` to **IPv6** can cause `ENETUNREACH`; forcing IPv4 fixes delivery. Set to `false` only if you must use IPv6 SMTP. |
| `SMTP_CONNECTION_TIMEOUT_MS` / `SMTP_GREETING_TIMEOUT_MS` / `SMTP_SOCKET_TIMEOUT_MS` | Optional timeouts (defaults ~15–20s) |

Generic SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) is also supported.

## Deployment on Render
This backend is configured for deployment on Render:

1. **Build Command**: `pnpm install --frozen-lockfile; pnpm run build`
2. **Start Command**: `pnpm run dev`
3. **Environment**: Set all required environment variables in Render dashboard
4. **Node Version**: 18.x or higher recommended

### Production checklist (Render)

1. **Stripe**
   - `STRIPE_SECRET_KEY` = key starting with **`sk_`** from [API keys](https://dashboard.stripe.com/apikeys).
   - Test and live keys must match your mode (`sk_test_` with test prices and test webhooks; `sk_live_` for production).
   - Webhook URL: `https://<your-render-service>/api/payments/webhook` with event `checkout.session.completed`.

2. **Email**
   - Set `GMAIL_USER` + `GMAIL_APP_PASSWORD` on Render (local `.env` is not uploaded; Render shows `injecting env (0) from .env` when no file is present — that is normal).
   - Keep **`SMTP_PREFER_IPV4` unset or `true`** so outbound SMTP uses IPv4 (avoids `ENETUNREACH` to Gmail’s IPv6 from some hosts).

3. **CORS / frontend**
   - Point `FRONTEND_BASE_URL` at your real static site URL so Checkout redirects work when the browser does not send an `Origin` header.

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