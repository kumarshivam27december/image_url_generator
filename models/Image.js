const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: String,
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', ImageSchema);
