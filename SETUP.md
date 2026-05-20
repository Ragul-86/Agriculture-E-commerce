# Quick Setup Guide

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Create Backend Environment File

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

## Step 3: Start Backend Server

```bash
cd backend
npm start
```

You should see: `🚀 Server running on http://localhost:5000`

## Step 4: Install Frontend Dependencies

Open a new terminal:
```bash
cd frontend
npm install
```

## Step 5: Create Frontend Environment File (Optional)

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Step 6: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

## Step 7: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Testing the Connection

1. Open the frontend in your browser
2. Try registering a new user
3. Check the backend terminal for API requests
4. Products should load from the backend API

## Troubleshooting

### Backend not starting?
- Check if port 5000 is already in use
- Verify Node.js version (v16+)
- Check that all dependencies are installed

### Frontend can't connect to backend?
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify VITE_API_BASE_URL in frontend/.env

### API calls failing?
- Check backend server logs
- Verify CORS is enabled in backend
- Check network tab in browser DevTools

