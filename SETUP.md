# Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

Run the following command from the project root:
```bash
npm run install-all
```

Or manually install:
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The AI features (waste classification and cleanup verification) will work with mock data if you don't provide an OpenAI API key. For production use, you should:
- Get an OpenAI API key from https://platform.openai.com/
- Add it to the `.env` file
- Modify `server/index.js` to use the actual OpenAI Vision API

### 3. Create Required Directories

The server will automatically create these directories on first run:
- `server/uploads/` - for uploaded images
- `server/data/` - for JSON database files

### 4. Start the Application

To start both frontend and backend together:
```bash
npm run dev
```

Or start them separately:

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Overview

### For Users:
1. **Register/Login**: Create an account or sign in
2. **Report Sites**: Upload images and location data for garbage sites
3. **Claim Sites**: Claim responsibility for cleaning up a reported site
4. **Submit Cleanup**: Upload cleanup images for AI verification
5. **Earn Points**: Get rewarded for reporting (10 pts) and cleaning (50 pts)
6. **View Leaderboard**: See top contributors
7. **Dashboard**: Track your contributions and points

### AI Features:
- **Waste Classification**: Automatically classifies waste types (plastic, metal, wood, etc.)
- **Cleanup Verification**: Verifies if cleanup images match the original report

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user details
- `POST /api/reports` - Create new report (multipart/form-data)
- `GET /api/reports` - Get all reports (with optional filters)
- `GET /api/reports/:id` - Get specific report
- `POST /api/reports/:id/claim` - Claim a report
- `POST /api/reports/:id/cleanup` - Submit cleanup verification
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/statistics` - Get platform statistics

## Production Deployment

For production deployment:

1. **Use a real database** (MongoDB, PostgreSQL, etc.) instead of JSON files
2. **Use cloud storage** (AWS S3, Cloudinary, etc.) for images
3. **Implement proper authentication** (JWT tokens, password hashing)
4. **Set up environment variables** properly
5. **Enable HTTPS**
6. **Add rate limiting** and security middleware
7. **Use a process manager** like PM2
8. **Build the React app**: `cd client && npm run build`
9. **Serve the build** with the Express server or a CDN

## Troubleshooting

### Port already in use
- Change the PORT in `server/.env` or kill the process using the port

### Images not loading
- Ensure the `server/uploads` directory exists
- Check that the server is running and accessible

### CORS errors
- The server is configured to allow requests from `localhost:3000`
- For production, update CORS settings in `server/index.js`

## Next Steps

- Integrate real AI services (OpenAI Vision API, TensorFlow.js models)
- Add email notifications
- Implement real-time updates
- Add mobile app support
- Enhance waste classification accuracy
- Add more gamification features
