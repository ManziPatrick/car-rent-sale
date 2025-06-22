const ContractTemplate = require('../models/ContractTemplate');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get all contract templates
exports.getAllTemplates = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const templates = await ContractTemplate.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await ContractTemplate.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ message: 'Contract template not found' });
    }
    
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new template
exports.createTemplate = async (req, res) => {
  try {
    const { name, type, content, variables, isActive } = req.body;
    
    const template = new ContractTemplate({
      name,
      type,
      content,
      variables: variables || [],
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });
    
    const savedTemplate = await template.save();
    await savedTemplate.populate('createdBy', 'name email');
    
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const { name, type, content, variables, isActive } = req.body;
    
    const template = await ContractTemplate.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        content,
        variables: variables || [],
        isActive
      },
      { new: true }
    ).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ message: 'Contract template not found' });
    }
    
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await ContractTemplate.findByIdAndDelete(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Contract template not found' });
    }
    
    res.json({ message: 'Contract template deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload PDF template
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const result = await uploadToCloudinary(req.file.path);
    
    const template = await ContractTemplate.findByIdAndUpdate(
      req.params.id,
      {
        pdfFile: {
          url: result.secure_url,
          filename: req.file.originalname
        }
      },
      { new: true }
    ).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ message: 'Contract template not found' });
    }
    
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate contract from template
exports.generateContract = async (req, res) => {
  try {
    const { templateId, orderId, variables } = req.body;
    
    const template = await ContractTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Contract template not found' });
    }
    
    // Replace variables in content
    let contractContent = template.content;
    if (variables) {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        contractContent = contractContent.replace(regex, variables[key]);
      });
    }
    
    res.json({
      template: template,
      generatedContent: contractContent,
      variables: variables || {}
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get templates by type
exports.getTemplatesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const templates = await ContractTemplate.find({
      type: { $in: [type, 'both'] },
      isActive: true
    }).populate('createdBy', 'name email');
    
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 