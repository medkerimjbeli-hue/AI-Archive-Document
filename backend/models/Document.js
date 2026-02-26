const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    // ---------------- FILE INFO ----------------
    filename: {
      type: String,
      required: true,
    },

    file_path: {
      type: String,
      default: null,
    },

    file_type: {
      type: String,
      default: '',
    },

    file_size: {
      type: Number,
      default: 0,
    },

    upload_date: {
      type: Date,
      default: Date.now,
    },

    // ---------------- DOCUMENT CONTENT ----------------
    content: {
      type: String,
      default: '',
    },

    extracted_text: {
      type: String,
      default: '',
    },

    // ---------------- CLASSIFICATION ----------------
    document_type: {
      type: String,
      default: 'Processing',
    },

    assigned_department: {
      type: String,
      default: 'Processing',
    },

    status: {
      type: String,
      enum: ['Processing', 'Processed', 'Rejected'],
      default: 'Processing',
    },

    reviewed: {
      type: Boolean,
      default: false,
    },

    // ---------------- AI OUTPUT ----------------
    summary: {
      type: String,
      default: '',
    },

    aiProcessedAt: {
      type: Date,
    },

    aiConfidence: {
      type: Number,
      default: 0,
    },

    aiKeyPoints: {
      type: [String],
      default: [],
    },

    // ---------------- FLEXIBLE METADATA ----------------
    metadata: {
      type: Object,
      default: {},
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);