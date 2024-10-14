const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  clientIdentifier: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  jpegName: {
    type: String
  },
  videoName: {
    type: String
  },
  filePath: {
    type: String,
    required: true,
  },
  height: {
    type: String,
  },
  width: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  imageBuffer: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Additional properties...
});

const File = mongoose.model('File', fileSchema);

module.exports = File;