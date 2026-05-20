# Backend API Server

Express.js backend server with MVC architecture and MongoDB integration.

## Architecture

This backend follows the **MVC (Model-View-Controller)** pattern:

- **Models**: Mongoose schemas (`models/`)
- **Views**: API responses (JSON)
- **Controllers**: Business logic (`controllers/`)
- **Routes**: Route definitions (`routes/`)
- **Middleware**: Authentication and authorization (`middleware/`)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/agriculture
```

3. Start MongoDB (if running locally):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

4. Seed initial products (optional):
```bash
npm run seed
```

5. Start server:
```bash
npm start
```

## API Structure

### Public Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Protected Routes (Require Authentication)
- `GET /api/auth/me` - Get current user
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

### Admin Routes (Require Admin Role)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Sales analytics
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are generated on login/register and expire after 7 days.

## Database Models

### User
- name, email, password, role (buyer/admin)
- phone, address
- isActive flag

### Product
- title, category, price, oldPrice
- image, images, rating
- description, stock
- isActive flag

### Order
- orderId (auto-generated)
- userId (reference to User)
- items, totalAmount
- address, paymentMethod
- status, paymentStatus
- trackingNumber

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with initial products

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODB_URI` - MongoDB connection string
