# 🌍 Trash2Treasure Platform

A community-driven web platform for reporting trash sites, organizing cleanups, and promoting sustainable waste management.

## Features

- 📸 **Report Trash Sites**: Upload images and location data for trash sites
- 👥 **Community Cleanup**: View and sign up to clean reported spots
- 🤖 **AI Verification**: Automatic verification of cleanup completion using AI
- 🗑️ **Waste Classification**: AI-powered automatic classification of waste types (plastic, metal, wood, etc.)
- 🏆 **Rewards System**: Earn points for reporting and cleaning up sites
- 📊 **Dashboard**: Track your contributions and community impact

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: JSON (can be migrated to MongoDB/PostgreSQL)
- **AI**: Integration ready for OpenAI Vision API or custom models
- **File Storage**: Local storage (can be upgraded to cloud storage)

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Create a `.env` file in the `server` directory:
```
PORT=5000
OPENAI_API_KEY=your_api_key_here (optional)
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package configuration
└── README.md        # This file
```

## API Endpoints

- `POST /api/reports` - Create a new trash report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get a specific report
- `POST /api/reports/:id/cleanup` - Submit cleanup verification
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id/points` - Get user points

## Contributing

This is a community project. Feel free to contribute!

## License

MIT
