const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  username: { type: String, required: true }
});

const Attachment = mongoose.model('Attachment', attachmentSchema, 'attachment');

module.exports = Attachment;
