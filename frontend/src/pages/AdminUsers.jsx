import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { name: '', email: '', isAdmin: false };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch users
  useEffect(() => {
    setLoading(true);
    api.get('/users')
      .then(res => {
        setUsers(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input
  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Open edit form
  const openForm = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    setEditId(user._id);
    setShowForm(true);
  };

  // Submit edit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${editId}`, form);
      // Refresh list
      const res = await api.get('/users');
      setUsers(res.data);
      setShowForm(false);
    } catch {
      setError('Failed to update user.');
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
      await api.delete(`/users/${deleteId}`);
      setUsers(users.filter(user => user._id !== deleteId));
      setShowDelete(false);
    } catch {
      setError('Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
      </div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full text-left border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-xs ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button onClick={() => openForm(user)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => openDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="mb-2 w-full px-3 py-2 border rounded" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="mb-2 w-full px-3 py-2 border rounded" required />
            <div className="mb-2 flex items-center gap-2">
              <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} />
              <label>Admin</label>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Update User</button>
          </form>
        </div>
      )}
      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <p className="mb-4">Are you sure you want to delete this user?</p>
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

export default AdminUsers; 