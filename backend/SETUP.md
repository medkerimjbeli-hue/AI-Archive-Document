# Backend Setup Guide

Your Node.js backend is ready! This guide will help you get everything running.

## Project Structure

```
backend/
├── index.js                  # Main server file
├── package.json             # Project dependencies
├── README.md               # Project overview
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── node_modules/           # Dependencies (created after npm install)
├── models/
│   └── Document.js         # Example MongoDB model
├── routes/
│   └── documents.js        # Example API routes
└── .vscode/
    ├── tasks.json          # VS Code tasks
    └── launch.json         # Debug configuration
```

## Prerequisites

1. **Node.js** - Already installed
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: Run MongoDB server locally on port 27017
   - **MongoDB Atlas**: Use cloud-hosted MongoDB (recommended for development)

## Setup Steps

### Step 1: Environment Configuration

The `.env` file is already created with default settings. Update it if needed:

```
MONGODB_URI=mongodb://localhost:27017/ai-doc-sys
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   - Windows: Services app → MongoDB Server → Start
   - Or run: `mongod` in a terminal

#### Option B: MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-doc-sys?retryWrites=true&w=majority
   ```

### Step 3: Run Backend

#### Using VS Code Tasks (Recommended)
1. Press `Ctrl+Shift+B` or go to Terminal → Run Task
2. Select "Start Backend Server" (production) or "Start Backend (Development)"
3. Backend will start on http://localhost:5000

#### Using Terminal
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

#### Debug Mode
1. Press `F5` or go to Run → Start Debugging
2. Click breakpoints in the code
3. Use Debug Console to inspect variables

## Testing the Backend

Once running, test with:

```bash
# Health check
curl http://localhost:5000/api/health

# Or in PowerShell:
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-02-23T20:45:00.000Z"
}
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Server status

### Documents (CRUD)
- **GET** `/api/documents` - Get all documents
- **GET** `/api/documents/:id` - Get single document
- **POST** `/api/documents` - Create document
- **PATCH** `/api/documents/:id` - Update document
- **DELETE** `/api/documents/:id` - Delete document

### Document Structure
```json
{
  "title": "Document Title",
  "content": "Document content here",
  "category": "general",
  "tags": ["tag1", "tag2"],
  "createdBy": "user@example.com",
  "status": "draft"
}
```

## Frontend Connection

Update your frontend to point to the backend API:

```javascript
// Example: React
const API_URL = 'http://localhost:5000/api';

// Fetch documents
fetch(`${API_URL}/documents`)
  .then(res => res.json())
  .then(data => console.log(data));

// Create document
fetch(`${API_URL}/documents`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Document',
    content: 'Content here',
    createdBy: 'user@example.com'
  })
})
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Check MongoDB connection string in `.env`
- Verify MongoDB is running

### MongoDB connection error
- For local: Run `mongod` in a terminal
- For Atlas: Check connection string and network settings
- Whitelist your IP in MongoDB Atlas

### CORS errors in frontend
- Update `.env` with correct `FRONTEND_URL`
- Or update CORS settings in `index.js`

### Port already in use
- Change PORT in `.env` to a different number (e.g., 5001)
- Or: Kill process on port 5000

## Next Steps

1. **Modify Models**: Edit `models/Document.js` for your data structure
2. **Add Routes**: Create new route files in `routes/` folder
3. **Add Authentication**: Implement user auth (JWT tokens)
4. **Add Validation**: Use middleware for data validation
5. **Deploy**: Deploy to AWS, Heroku, or your cloud provider

## Useful Commands

```bash
# View dependencies
npm list

# Check for vulnerabilities
npm audit

# Update packages
npm update

# Install specific package
npm install package-name
```

## Support

- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- Node.js: https://nodejs.org/
