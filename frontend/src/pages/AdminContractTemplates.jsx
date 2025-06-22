import { useState, useEffect } from 'react';
import api from '../services/api';

const initialForm = {
  name: '',
  type: 'both',
  content: '',
  variables: [],
  isActive: true
};

const AdminContractTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contract-templates');
      setTemplates(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load contract templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleVariableChange = (index, field, value) => {
    const newVariables = [...form.variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    setForm({ ...form, variables: newVariables });
  };

  const addVariable = () => {
    setForm({
      ...form,
      variables: [...form.variables, { name: '', description: '', defaultValue: '' }]
    });
  };

  const removeVariable = (index) => {
    const newVariables = form.variables.filter((_, i) => i !== index);
    setForm({ ...form, variables: newVariables });
  };

  const openForm = (template = null) => {
    if (template) {
      setForm({
        name: template.name || '',
        type: template.type || 'both',
        content: template.content || '',
        variables: template.variables || [],
        isActive: template.isActive !== undefined ? template.isActive : true
      });
      setEditId(template._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowForm(true);
    setSelectedFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editId) {
        await api.put(`/contract-templates/${editId}`, form);
      } else {
        await api.post('/contract-templates', form);
      }

      fetchTemplates();
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      console.error('Error saving template:', err);
      setError(err.response?.data?.message || 'Failed to save template');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileUpload = async (templateId) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      await api.post(`/contract-templates/${templateId}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchTemplates();
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to upload PDF');
    }
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/contract-templates/${deleteId}`);
      setTemplates(templates.filter(template => template._id !== deleteId));
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template');
    } finally {
      setFormLoading(false);
    }
  };

  const generatePreview = () => {
    let content = form.content;
    form.variables.forEach(variable => {
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(regex, variable.defaultValue || `[${variable.name}]`);
    });
    setPreviewContent(content);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading contract templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contract Templates</h2>
        <button
          onClick={() => openForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Template
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(templates) && templates.length > 0 ? templates.map(template => (
          <div key={template._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500">Type: {template.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {template.content.substring(0, 150)}...
              </p>
            </div>

            {template.variables && template.variables.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {variable.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {template.pdfFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-1">PDF Template:</p>
                <a 
                  href={template.pdfFile.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {template.pdfFile.filename}
                </a>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => openForm(template)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDelete(template._id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(template.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No contract templates found. Create your first template to get started.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editId ? 'Edit Template' : 'Create Template'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="buy">Buy Only</option>
                    <option value="rent">Rent Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your contract template content. Use {{variable_name}} for dynamic variables."
                  required
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Variables
                  </label>
                  <button
                    type="button"
                    onClick={addVariable}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Add Variable
                  </button>
                </div>

                {form.variables.map((variable, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      placeholder="Variable name"
                      value={variable.name}
                      onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      placeholder="Description"
                      value={variable.description}
                      onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Default value"
                        value={variable.defaultValue}
                        onChange={(e) => handleVariableChange(index, 'defaultValue', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariable(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={generatePreview}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : (editId ? 'Update Template' : 'Create Template')}
                </button>
              </div>
            </form>

            {/* Preview Section */}
            {previewContent && (
              <div className="p-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{previewContent}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this contract template? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDelete}
                disabled={formLoading}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContractTemplates; 