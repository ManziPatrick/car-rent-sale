const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'user', 'system'],
    required: true
  },
  variables: [{
    type: String,
    default: []
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema); 