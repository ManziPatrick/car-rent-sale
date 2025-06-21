import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', type: '' });

  // Fetch notifications and templates
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/admin/notifications'),
      api.get('/admin/email-templates')
    ])
      .then(([notifRes, templateRes]) => {
        setNotifications(notifRes.data);
        setTemplates(templateRes.data);
        setError(null);
      })
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save email template
  const handleSaveTemplate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedTemplate) {
        await api.put(`/admin/email-templates/${selectedTemplate._id}`, form);
      } else {
        await api.post('/admin/email-templates', form);
      }
      // Refresh templates
      const res = await api.get('/admin/email-templates');
      setTemplates(res.data);
      setShowTemplateForm(false);
      setForm({ name: '', subject: '', body: '', type: '' });
      setSelectedTemplate(null);
    } catch {
      setError('Failed to save template.');
    } finally {
      setLoading(false);
    }
  };

  // Send test email
  const handleSendTest = async (templateId) => {
    try {
      await api.post(`/admin/send-test-email/${templateId}`);
      alert('Test email sent successfully!');
    } catch {
      setError('Failed to send test email.');
    }
  };

  // Send notification to all users
  const handleSendToAll = async (templateId) => {
    if (!confirm('Are you sure you want to send this email to all users?')) return;
    setLoading(true);
    try {
      await api.post(`/admin/send-bulk-email/${templateId}`);
      alert('Bulk email sent successfully!');
    } catch {
      setError('Failed to send bulk email.');
    } finally {
      setLoading(false);
    }
  };

  // Open template form
  const openTemplateForm = (template = null) => {
    if (template) {
      setForm({
        name: template.name,
        subject: template.subject,
        body: template.body,
        type: template.type,
      });
      setSelectedTemplate(template);
    } else {
      setForm({ name: '', subject: '', body: '', type: '' });
      setSelectedTemplate(null);
    }
    setShowTemplateForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Email Notifications</h2>
        <button onClick={() => openTemplateForm()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Template
        </button>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Email Templates */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Email Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template._id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{template.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  template.type === 'order' ? 'bg-blue-100 text-blue-800' :
                  template.type === 'user' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {template.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
              <div className="flex gap-2">
                <button onClick={() => openTemplateForm(template)} className="text-blue-600 hover:underline text-sm">
                  Edit
                </button>
                <button onClick={() => handleSendTest(template._id)} className="text-green-600 hover:underline text-sm">
                  Test
                </button>
                <button onClick={() => handleSendToAll(template._id)} className="text-purple-600 hover:underline text-sm">
                  Send to All
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification History */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Notification History</h3>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Recipient</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notification => (
              <tr key={notification._id} className="border-t">
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    notification.type === 'order' ? 'bg-blue-100 text-blue-800' :
                    notification.type === 'user' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {notification.type}
                  </span>
                </td>
                <td className="py-2 px-4">{notification.recipient}</td>
                <td className="py-2 px-4">{notification.subject}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                    notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.status}
                  </span>
                </td>
                <td className="py-2 px-4">{new Date(notification.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSaveTemplate} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button type="button" onClick={() => setShowTemplateForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4">{selectedTemplate ? 'Edit Template' : 'Add Template'}</h3>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Template Name" className="mb-2 w-full px-3 py-2 border rounded" required />
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Email Subject" className="mb-2 w-full px-3 py-2 border rounded" required />
            <select name="type" value={form.type} onChange={handleChange} className="mb-2 w-full px-3 py-2 border rounded" required>
              <option value="">Select Type</option>
              <option value="order">Order Notification</option>
              <option value="user">User Notification</option>
              <option value="system">System Notification</option>
            </select>
            <textarea name="body" value={form.body} onChange={handleChange} placeholder="Email Body (use {{variable}} for dynamic content)" className="mb-2 w-full px-3 py-2 border rounded h-32" required />
            <div className="text-sm text-gray-500 mb-4">
              Available variables: {{userName}}, {{orderId}}, {{carName}}, {{status}}, {{date}}
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              {selectedTemplate ? 'Update' : 'Add'} Template
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications; 