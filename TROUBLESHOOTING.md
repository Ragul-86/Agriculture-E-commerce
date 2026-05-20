# Troubleshooting Guide

## Products Not Showing

If products are not showing on the frontend, follow these steps:

### 1. Check MongoDB Connection

Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 2. Check Database Connection

Verify your `.env` file has the correct MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/agriculture
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agriculture
```

### 3. Check if Products Exist

Run the check script:
```bash
cd backend
npm run check-products
```

### 4. Seed Products

If no products exist, seed them:
```bash
cd backend
npm run seed
```

### 5. Check Backend Server

Make sure the backend server is running:
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: localhost:27017
📊 Database: agriculture
🚀 Server running on http://localhost:5000
```

### 6. Check Frontend Connection

Verify the frontend can connect to the backend:
- Open browser DevTools (F12)
- Go to Network tab
- Check if `/api/products` request is successful
- Look for CORS errors

### 7. Common Issues

#### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Make sure MongoDB is installed and running
- Check if the port (27017) is correct
- Verify MONGODB_URI in `.env` file

#### Issue: "No products found"
**Solution**: 
- Run `npm run seed` to populate the database
- Check if products have `isActive: true`

#### Issue: "CORS error"
**Solution**: 
- Make sure backend CORS is enabled
- Check if backend is running on port 5000
- Verify frontend proxy configuration in `vite.config.js`

#### Issue: "Products show but can't add to cart"
**Solution**: 
- Check browser console for errors
- Verify product has `id` or `_id` field
- Check ProductCard component

### 8. Debug Steps

1. **Check Backend Logs**: Look at the terminal where backend is running
2. **Check Browser Console**: Open DevTools and check for errors
3. **Test API Directly**: Visit `http://localhost:5000/api/products` in browser
4. **Check Network Tab**: See if API calls are being made

### 9. Reset Database

If you need to start fresh:
```bash
# Connect to MongoDB
mongosh

# Switch to database
use agriculture

# Drop collections
db.products.drop()
db.users.drop()
db.orders.drop()

# Exit
exit

# Re-seed
npm run seed
```

### 10. Still Not Working?

1. Check all environment variables are set
2. Verify MongoDB version compatibility
3. Check Node.js version (should be v16+)
4. Clear browser cache
5. Restart both frontend and backend servers

