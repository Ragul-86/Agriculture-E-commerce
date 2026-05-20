# Agriculture E-commerce Platform

A full-stack e-commerce platform for agricultural products with React frontend and Node.js/Express backend.

## Features

- 🛒 Product browsing and shopping cart
- 👤 User authentication (registration & login)
- 📦 Order management
- 🔐 Admin dashboard
- 📊 Analytics and reporting
- 💳 Multiple payment methods

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (password hashing)
- MVC Architecture

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Install MongoDB** (if not already installed):
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/agriculture
```

   For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agriculture
```

5. Seed initial products (optional):
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user (Protected)

### Orders
- `GET /api/orders` - Get all orders (or user's orders with ?userId=)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics` - Get sales analytics

## Default Admin Credentials

- Email: `admin@agriculture.com`
- Password: `admin123`

## Project Structure

```
agriculture/
├── backend/
│   ├── config/          # Configuration files (database)
│   ├── controllers/     # Controllers (MVC)
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/           # API route handlers
│   ├── scripts/         # Utility scripts (seed data)
│   ├── server.js         # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/         # API service files
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── admin/       # Admin components
│   └── package.json
└── README.md
```

## Development Notes

- **MVC Architecture**: Backend follows Model-View-Controller pattern
- **MongoDB**: Uses MongoDB for data storage with Mongoose ODM
- **Authentication**: JWT tokens for authentication with protected routes
- **Password Security**: Passwords are hashed using bcryptjs
- **Admin Routes**: Separate admin routes with role-based access control
- **CORS**: Enabled for frontend-backend communication
- **Vite Proxy**: Configured for API calls during development

## Production Deployment

1. Set proper environment variables (especially JWT_SECRET and MONGODB_URI)
2. Use MongoDB Atlas or a production MongoDB instance
3. Configure proper CORS settings for your domain
4. Use environment-specific API URLs
5. Enable HTTPS
6. Set up proper error logging and monitoring
7. Use environment variables for all sensitive data
8. Consider adding rate limiting for API endpoints

## License

ISC

