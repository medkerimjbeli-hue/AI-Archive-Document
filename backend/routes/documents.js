// backend/routes/documents.js
const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OpenAI = require("openai");

// ---------- OPENAI CONFIG ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ---------- CREATE DOCUMENT (UPLOAD FILE) ----------
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const doc = new Document({
      title: file.originalname,
      filename: file.originalname,
      file_path: file.filename,
      document_type: req.body.document_type || 'General',
      assigned_department: req.body.assigned_department || 'Archives',
      status: 'Processing',
      reviewed: false,
      upload_date: new Date(),
      metadata: {},
    });

    const savedDoc = await doc.save();

    // Run AI classification & summarization asynchronously
    processAI(savedDoc._id).catch(err => console.error('AI processing failed:', err));

    res.status(201).json(savedDoc);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// ---------- AI PROCESSING FUNCTION ----------
async function processAI(docId) {
  const doc = await Document.findById(docId);
  if (!doc) return;

  const text = doc.extracted_text || "Text not extracted yet.";

  // --- Descriptive AI: classify document ---
  const classificationPrompt = `
Classify the following text into one of these categories:
Invoice, Contract, Identity Document, Receipt, Letter, Official Form.
Text: "${text}"
Answer with only the category name.
  `;

  const classificationResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: classificationPrompt }],
    temperature: 0
  });
  const autoType = classificationResponse.choices[0].message.content.trim();

  // --- Generative AI: summary ---
  const summaryPrompt = `
Summarize the following text in 2-3 sentences:
"${text}"
  `;
  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: summaryPrompt }],
    temperature: 0.3
  });
  const summary = summaryResponse.choices[0].message.content.trim();

  // Update document
  doc.document_type = autoType || doc.document_type;
  doc.summary = summary;
  doc.status = 'Completed';
  await doc.save();
}

// ---------- MANUAL AI PROCESSING ----------
router.post('/:id/process', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    await processAI(doc._id);
    const updatedDoc = await Document.findById(doc._id);

    res.json({ doc: updatedDoc, message: 'Document processed by AI' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI processing failed', error: err.message });
  }
});

// ---------- GET ALL DOCUMENTS ----------
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ upload_date: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- GET SINGLE DOCUMENT ----------
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- UPDATE DOCUMENT ----------
router.patch('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const fields = ['title','document_type','assigned_department','status','reviewed','extracted_text','metadata','file_path'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    });

    const updatedDoc = await doc.save();
    res.json(updatedDoc);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- DELETE DOCUMENT ----------
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;