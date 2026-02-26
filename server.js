require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

/* ===========================
   BASIC MIDDLEWARE
=========================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   ENSURE UPLOADS FOLDER EXISTS
=========================== */

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

/* ===========================
   SERVE UPLOADED FILES
=========================== */

app.use('/uploads', express.static(uploadsDir));

/* ===========================
   MONGODB CONNECTION
=========================== */

const connectDB = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/ai-doc-sys';

    await mongoose.connect(MONGODB_URI);

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

/* ===========================
   ROUTES
=========================== */

app.get('/', (req, res) => {
  res.json({
    message: 'AI-DOC-SYS Backend API is running',
    version: '2.0.0',
    status: 'active'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/* ===========================
   DOCUMENT ROUTES
=========================== */

const documentsRouter = require('./routes/documents');
app.use('/api/documents', documentsRouter);

/* ===========================
   ERROR HANDLING
=========================== */

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

/* ===========================
   404 HANDLER
=========================== */

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

/* ===========================
   START SERVER
=========================== */

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('\n==================================================');
    console.log('🚀 AI-DOC-SYS Backend Server');
    console.log('==================================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-doc-sys'}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('==================================================\n');
  });
}

module.exports = app;