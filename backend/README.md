# AI-DOC-SYS Backend

Node.js backend server for AI-DOC-SYS using Express.js and MongoDB.

**→ [Start Here: Complete Setup Guide](SETUP.md)**

## Quick Start

1. Ensure `.env` is configured (copy from `.env.example` if needed)
2. Start MongoDB or set up MongoDB Atlas connection
3. Run: `npm start` (production) or `npm run dev` (development)
4. Backend will be available at `http://localhost:5000`

## Features

- ✅ Express.js REST API server
- ✅ MongoDB integration with Mongoose ODM
- ✅ CORS configured for frontend connection
- ✅ Example CRUD routes for documents
- ✅ Error handling middleware
- ✅ Environment configuration
- ✅ Nodemon for development auto-reload
- ✅ VS Code debugging support

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create document
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

## Documentation

- **[Setup Guide](SETUP.md)** - Complete setup and running instructions
- **[Models](models/)** - Database schemas (Document.js)
- **[Routes](routes/)** - API route handlers

## Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Nodemon** - Development server auto-reload

## License

ISC
