const mongoose = require('mongoose');

const contractTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['buy', 'rent', 'both'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  variables: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    defaultValue: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdfFile: {
    url: String,
    filename: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContractTemplate', contractTemplateSchema); 