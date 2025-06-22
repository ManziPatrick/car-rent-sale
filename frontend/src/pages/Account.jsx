import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '' });
      setLoading(true);
      api.get('/orders/my')
        .then(res => setOrders(res.data))
        .catch(() => setError('Failed to load orders.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put('/users/profile', form);
      setSuccess(true);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center py-12 text-red-500">You must be logged in to view this page.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">My Account</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="bg-blue-100 text-blue-700 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">{user.name[0]}</div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">Car</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-t">
                    <td className="py-2 px-4">
                      {order.car ? `${order.car.brand} ${order.car.model} (${order.car.year})` : 'N/A'}
                    </td>
                    <td className="py-2 px-4">{order.createdAt?.slice(0, 10)}</td>
                    <td className="py-2 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
          <form className="flex flex-col gap-4 max-w-md" onSubmit={handleUpdate}>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password" className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            {success && <div className="text-green-600 text-center">Profile updated!</div>}
            {error && <div className="text-red-500 text-center">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account; 