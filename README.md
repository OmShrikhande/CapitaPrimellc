# CapitaPrimellc Frontend

Welcome to CapitaPrimellc - your premier asset management platform! This modern React application empowers businesses with comprehensive asset tracking, featuring a powerful admin panel and intuitive public listings that make managing and discovering assets effortless.

## Features

- **Admin Panel**: Secure admin interface for managing assets and content
- **Asset Inventory**: Complete CRUD operations for asset management
- **Public Listings**: Display assets with filtering and search capabilities
- **Theme Management**: Dynamic theming system
- **Responsive Design**: Mobile-first approach with modern UI
- **JWT Authentication**: Secure admin access with token-based authentication

## Tech Stack

- **React 19**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd capita-primellc/frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_BASE_URL=http://localhost:3000
# or for production
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

5. Start development server:
```bash
pnpm run dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin panel components
│   │   ├── AssetsView.jsx      # Asset management interface
│   │   ├── DashboardView.jsx   # Admin dashboard
│   │   └── ...
│   └── ListingsPage.jsx # Public asset listings
├── context/             # React Context providers
│   ├── api.js          # API client and endpoints
│   ├── CMSContext.jsx  # CMS state management
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
├── assets/             # Static assets
└── App.jsx             # Main application component
```

## API Integration

The frontend communicates with the backend API through the `src/context/api.js` file. All API calls are handled through this centralized client.

### Asset Management APIs

#### Get All Assets
```javascript
import { adminAPI } from '../context/api';

// Get all assets (public)
const assets = await adminAPI.assets.getAll();
```

#### Get Single Asset
```javascript
// Get specific asset by ID (public)
const asset = await adminAPI.assets.get(id);
```

#### Create Asset (Admin Only)
```javascript
// Create new asset with images
const formData = {
  name: 'Office Desk',
  type: 'Furniture',
  quantity: 5,
  location: 'Dubai Office',
  description: 'Modern office desk',
  images: [file1, file2, file3] // Up to 7 files
};

const newAsset = await adminAPI.assets.create(formData);
```

#### Update Asset (Admin Only)
```javascript
// Update existing asset
const updateData = {
  name: 'Updated Office Desk',
  quantity: 3,
  images: [newFile] // Add additional images
};

const updatedAsset = await adminAPI.assets.update(assetId, updateData);
```

#### Delete Asset (Admin Only)
```javascript
// Delete asset
await adminAPI.assets.delete(assetId);
```

### Authentication APIs

#### Admin Login
```javascript
const response = await adminAPI.login(email, password);
if (response.success) {
  // Login successful, token stored automatically
}
```

#### Check Authentication Status
```javascript
const isAuthenticated = adminAPI.isAuthenticated();
const user = adminAPI.getUser();
```

## Admin Panel

Access the admin panel at `/admin`. The admin interface provides:

- **Asset Inventory Management**: Create, read, update, and delete assets
- **Image Upload**: Support for up to 7 images per asset
- **Theme Management**: Customize site appearance
- **Content Management**: Manage site content and settings

### Admin Features

1. **Asset Management**:
   - Add new assets with multiple images
   - Edit existing assets
   - Delete assets and associated images
   - View asset inventory with stock status

2. **Image Handling**:
   - Upload up to 7 images per asset
   - Automatic image optimization
   - Secure file storage on server
   - Image preview and management

3. **Security**:
   - JWT token-based authentication
   - Protected admin routes
   - Secure API endpoints

## Public Interface

The public-facing application includes:

- **Asset Listings**: Browse available assets
- **Asset Details**: View detailed asset information
- **Responsive Design**: Optimized for all devices
- **Dynamic Theming**: Theme changes apply in real-time

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Code Style

The project follows modern React best practices:

- Functional components with hooks
- Custom hooks for reusable logic
- Context API for state management
- Tailwind CSS for styling
- Component composition over inheritance

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Deployment

### Build for Production

```bash
pnpm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Setup

Ensure the following environment variables are set in your deployment platform:

- `VITE_API_BASE_URL`: Your backend API URL

## Upcoming Features

We're continuously improving CapitaPrimellc to provide the best asset management experience. Here are some exciting features coming soon:

- **Payment Gateway Integration**: Enable secure online transactions for asset purchases, with support for multiple payment methods and currencies.

## Contributing

1. Follow the existing code style and structure
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is proprietary software owned by CapitaPrimellc.