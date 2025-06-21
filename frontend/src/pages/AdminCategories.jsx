import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { name: '', description: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories
  useEffect(() => {
    setLoading(true);
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open add/edit form
  const openForm = (category = null) => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description,
      });
      setEditId(category._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowForm(true);
  };

  // Submit add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
      } else {
        await api.post('/categories', form);
      }
      // Refresh list
      const res = await api.get('/categories');
      setCategories(res.data);
      setShowForm(false);
    } catch {
      setError('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const openDelete = id => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/categories/${deleteId}`);
      setCategories(categories.filter(cat => cat._id !== deleteId));
      setShowDelete(false);
    } catch {
      setError('Failed to delete category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <button onClick={() => openForm()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Category</button>
      </div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full text-left border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id} className="border-t">
              <td className="py-2 px-4">{category.name}</td>
              <td className="py-2 px-4">{category.description}</td>
              <td className="py-2 px-4 flex gap-2">
                <button onClick={() => openForm(category)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => openDelete(category._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Category' : 'Add Category'}</h3>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="mb-2 w-full px-3 py-2 border rounded" required />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="mb-2 w-full px-3 py-2 border rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">{editId ? 'Update' : 'Add'} Category</button>
          </form>
        </div>
      )}
      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <p className="mb-4">Are you sure you want to delete this category?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
              <button onClick={() => setShowDelete(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 