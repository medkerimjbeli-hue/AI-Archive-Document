# Quick Reference

## 🚀 Start Backend

### Option 1: Windows Batch File
```
Double-click: start-backend.bat
```

### Option 2: Terminal
```bash
npm start          # Production mode
npm run dev        # Development mode (auto-reload)
```

### Option 3: VS Code
- Press `Ctrl+Shift+B` → Select "Start Backend Server"
- Or `F5` to debug

## 📍 Server Address
```
http://localhost:5000
```

## 🔌 MongoDB Setup (REQUIRED)

**Choose ONE:**

### Local MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Run `mongod` in terminal
3. Update `.env`: `MONGODB_URI=mongodb://localhost:27017/ai-doc-sys`

### MongoDB Atlas (Recommended)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/db`
4. Update `.env`: `MONGODB_URI=your-connection-string`

## ✅ Test It
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","timestamp":"..."}
```

## 📚 Full Docs
See [SETUP.md](SETUP.md) for complete documentation

## 🔗 Connect Frontend
```javascript
const API = 'http://localhost:5000/api';

fetch(`${API}/documents`)
  .then(r => r.json())
  .then(data => console.log(data));
```

## 🆘 Issues?

**Server won't start?**
- MongoDB is not running → Start MongoDB
- Port 5000 in use → Change PORT in .env

**MongoDB connection error?**
- Local: Run `mongod` command
- Atlas: Check connection string and IP whitelist

**CORS errors?**
- Update `FRONTEND_URL` in .env file
