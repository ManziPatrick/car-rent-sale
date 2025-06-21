import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    api.get('/orders')
      .then(res => {
        setOrders(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || 
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.car?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle bulk selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Bulk operations
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(selectedOrders.map(async (id) => {
        const order = orders.find(o => o._id === id);
        await api.put(`/orders/${id}`, { status: newStatus });
        
        // Send status update email
        if (order && order.user?.email) {
          try {
            await api.post('/orders/send-status-update', {
              orderId: id,
              userEmail: order.user.email,
              userName: order.user.name,
              carName: order.car?.name,
              oldStatus: order.status,
              newStatus: newStatus,
            });
          } catch (emailError) {
            console.log('Status update email failed:', emailError);
          }
        }
      }));
      
      // Refresh orders
      const res = await api.get('/orders');
      setOrders(res.data);
      setSelectedOrders([]);
    } catch {
      setError('Failed to update orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) return;
    setLoading(true);
    try {
      await Promise.all(selectedOrders.map(id => api.delete(`/orders/${id}`)));
      setOrders(orders.filter(order => !selectedOrders.includes(order._id)));
      setSelectedOrders([]);
    } catch {
      setError('Failed to delete orders.');
    } finally {
      setLoading(false);
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Update single order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o._id === orderId);
      const oldStatus = order.status;
      
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Send status update email
      if (order && order.user?.email) {
        try {
          await api.post('/orders/send-status-update', {
            orderId: orderId,
            userEmail: order.user.email,
            userName: order.user.name,
            carName: order.car?.name,
            oldStatus: oldStatus,
            newStatus: newStatus,
          });
        } catch (emailError) {
          console.log('Status update email failed:', emailError);
        }
      }
    } catch {
      setError('Failed to update order status.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        {selectedOrders.length > 0 && (
          <div className="flex gap-2">
            <select 
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">Update Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Delete Selected ({selectedOrders.length})
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <table className="w-full text-left border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
              />
            </th>
            <th className="py-2 px-4">User</th>
            <th className="py-2 px-4">Car</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order._id} className="border-t">
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={(e) => handleSelectOrder(order._id, e.target.checked)}
                />
              </td>
              <td className="py-2 px-4">{order.user?.name || 'Unknown'}</td>
              <td className="py-2 px-4">{order.car?.name || 'Unknown'}</td>
              <td className="py-2 px-4">{order.type}</td>
              <td className="py-2 px-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4">
                <button onClick={() => viewOrderDetails(order)} className="text-blue-600 hover:underline mr-2">
                  View
                </button>
                <button onClick={() => api.delete(`/orders/${order._id}`).then(() => setOrders(orders.filter(o => o._id !== order._id)))} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button onClick={() => setShowDetails(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">User Information</h4>
                <p>Name: {selectedOrder.user?.name}</p>
                <p>Email: {selectedOrder.user?.email}</p>
              </div>
              <div>
                <h4 className="font-semibold">Car Information</h4>
                <p>Name: {selectedOrder.car?.name}</p>
                <p>Price: {selectedOrder.car?.price}</p>
              </div>
              <div>
                <h4 className="font-semibold">Order Information</h4>
                <p>Type: {selectedOrder.type}</p>
                <p>Status: {selectedOrder.status}</p>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 