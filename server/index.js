const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// In-memory database (replace with real database in production)
let reports = [];
let users = [];
let cleanups = [];

// Helper function to load data
function loadData() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  try {
    if (fs.existsSync(path.join(dataDir, 'reports.json'))) {
      reports = JSON.parse(fs.readFileSync(path.join(dataDir, 'reports.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(dataDir, 'users.json'))) {
      users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(dataDir, 'cleanups.json'))) {
      cleanups = JSON.parse(fs.readFileSync(path.join(dataDir, 'cleanups.json'), 'utf8'));
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Helper function to save data
function saveData() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'reports.json'), JSON.stringify(reports, null, 2));
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'cleanups.json'), JSON.stringify(cleanups, null, 2));
}

// Load data on startup
loadData();

// AI Service for waste classification and verification
class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async classifyWaste(imagePath) {
    // In production, integrate with OpenAI Vision API or custom ML model
    // For now, return mock classification
    const wasteTypes = ['plastic', 'metal', 'wood', 'paper', 'glass', 'organic', 'mixed'];
    const classifications = {};
    
    // Simulate classification (replace with actual AI call)
    wasteTypes.forEach(type => {
      classifications[type] = Math.random() * 100;
    });
    
    // Get top 3 classifications
    const sorted = Object.entries(classifications)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, confidence]) => ({ type, confidence: Math.round(confidence) }));
    
    return sorted;
  }

  async verifyCleanup(originalImagePath, cleanupImagePath) {
    // In production, use OpenAI Vision API to compare images
    // For now, return mock verification
    const similarity = Math.random() * 40 + 60; // 60-100% similarity
    const verified = similarity > 70;
    
    return {
      verified,
      similarity: Math.round(similarity),
      message: verified 
        ? 'Cleanup verified successfully!' 
        : 'Cleanup needs more work. Please ensure the area matches the original report.'
    };
  }
}

const aiService = new AIService();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User routes
app.post('/api/users/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const user = {
    id: uuidv4(),
    username,
    email,
    password, // In production, hash this!
    points: 0,
    reportsCreated: 0,
    cleanupsCompleted: 0,
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  saveData();
  
  res.json({ user: { ...user, password: undefined }, token: 'mock_token_' + user.id });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ user: { ...user, password: undefined }, token: 'mock_token_' + user.id });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ ...user, password: undefined });
});

// Reports routes
app.post('/api/reports', upload.single('image'), async (req, res) => {
  try {
    const { latitude, longitude, description, address, reporterId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Classify waste using AI
    const classifications = await aiService.classifyWaste(req.file.path);
    
    const report = {
      id: uuidv4(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || 'Address not provided',
      description: description || '',
      imageUrl,
      originalImagePath: req.file.path,
      reporterId: reporterId || 'anonymous',
      status: 'reported', // reported, claimed, cleaned, verified
      wasteClassifications: classifications,
      pointsAwarded: 10,
      createdAt: new Date().toISOString(),
      claimedBy: null,
      cleanupImages: []
    };
    
    reports.push(report);
    
    // Award points to reporter
    if (reporterId && reporterId !== 'anonymous') {
      const user = users.find(u => u.id === reporterId);
      if (user) {
        user.points += report.pointsAwarded;
        user.reportsCreated += 1;
      }
    }
    
    saveData();
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.get('/api/reports', (req, res) => {
  const { status, userId } = req.query;
  
  let filteredReports = [...reports];
  
  if (status) {
    filteredReports = filteredReports.filter(r => r.status === status);
  }
  
  if (userId) {
    filteredReports = filteredReports.filter(r => 
      r.reporterId === userId || r.claimedBy === userId
    );
  }
  
  // Sort by most recent first
  filteredReports.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  res.json(filteredReports);
});

app.get('/api/reports/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  res.json(report);
});

app.post('/api/reports/:id/claim', (req, res) => {
  const { userId } = req.body;
  const report = reports.find(r => r.id === req.params.id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  if (report.status !== 'reported') {
    return res.status(400).json({ error: 'Report is not available for claiming' });
  }
  
  report.status = 'claimed';
  report.claimedBy = userId;
  saveData();
  
  res.json(report);
});

app.post('/api/reports/:id/cleanup', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.body;
    const report = reports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Cleanup image is required' });
    }
    
    const cleanupImageUrl = `/uploads/${req.file.filename}`;
    
    // Verify cleanup using AI
    const verification = await aiService.verifyCleanup(
      report.originalImagePath,
      req.file.path
    );
    
    const cleanup = {
      id: uuidv4(),
      reportId: req.params.id,
      userId,
      cleanupImageUrl,
      cleanupImagePath: req.file.path,
      verification,
      submittedAt: new Date().toISOString()
    };
    
    cleanups.push(cleanup);
    report.cleanupImages.push(cleanupImageUrl);
    
    if (verification.verified) {
      report.status = 'verified';
      
      // Award points to cleaner
      if (userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
          user.points += 50; // More points for cleaning
          user.cleanupsCompleted += 1;
        }
      }
    } else {
      report.status = 'cleaned'; // Needs verification
    }
    
    saveData();
    
    res.json({
      cleanup,
      report,
      message: verification.verified 
        ? 'Cleanup verified! Points awarded.' 
        : verification.message
    });
  } catch (error) {
    console.error('Error submitting cleanup:', error);
    res.status(500).json({ error: 'Failed to submit cleanup' });
  }
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = users
    .map(u => ({
      id: u.id,
      username: u.username,
      points: u.points,
      reportsCreated: u.reportsCreated,
      cleanupsCompleted: u.cleanupsCompleted
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 100);
  
  res.json(leaderboard);
});

// Statistics
app.get('/api/statistics', (req, res) => {
  const stats = {
    totalReports: reports.length,
    totalCleanups: cleanups.filter(c => c.verification.verified).length,
    totalUsers: users.length,
    totalPointsAwarded: users.reduce((sum, u) => sum + u.points, 0),
    reportsByStatus: {
      reported: reports.filter(r => r.status === 'reported').length,
      claimed: reports.filter(r => r.status === 'claimed').length,
      cleaned: reports.filter(r => r.status === 'cleaned').length,
      verified: reports.filter(r => r.status === 'verified').length
    },
    wasteTypeDistribution: {}
  };
  
  // Calculate waste type distribution
  reports.forEach(report => {
    report.wasteClassifications.forEach(({ type, confidence }) => {
      if (!stats.wasteTypeDistribution[type]) {
        stats.wasteTypeDistribution[type] = 0;
      }
      stats.wasteTypeDistribution[type] += 1;
    });
  });
  
  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadsDir}`);
});
