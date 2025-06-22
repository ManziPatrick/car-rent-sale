import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      console.log('Orders API response:', response.data); // Debug log
      
      // Handle different response structures
      let ordersData = [];
      let paginationData = { current: 1, pages: 1, total: 0 };
      
      if (response.data && response.data.orders) {
        // Backend returns { orders, pagination }
        ordersData = Array.isArray(response.data.orders) ? response.data.orders : [];
        paginationData = response.data.pagination || { current: 1, pages: 1, total: 0 };
      } else if (Array.isArray(response.data)) {
        // Direct array response
        ordersData = response.data;
        paginationData = { current: 1, pages: 1, total: response.data.length };
      } else {
        // Fallback
        ordersData = [];
        paginationData = { current: 1, pages: 1, total: 0 };
      }
      
      setOrders(ordersData);
      setPagination(paginationData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setOrders([]);
      setPagination({ current: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (order) => {
    setSelected(order);
    setStatus(order.status);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleSave = async () => {
    if (!selected) return;
    
    setLoading(true);
    try {
      await ordersAPI.updateStatus(selected._id, status);
      setSelected({ ...selected, status });
      setSelected(null);
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContract = async (orderId) => {
    if (!confirm('Are you sure you want to approve this contract?')) return;
    
    setLoading(true);
    try {
      await ordersAPI.approveContract(orderId);
      fetchOrders(); // Refresh the list
      setError(null);
    } catch (err) {
      console.error('Error approving contract:', err);
      setError('Failed to approve contract.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await ordersAPI.delete(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Orders</h2>
        <div className="flex gap-2">
          <button 
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(orders) ? orders.length : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Array.isArray(orders) ? orders.filter(o => o.status === 'pending').length : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {Array.isArray(orders) ? orders.filter(o => o.status === 'confirmed').length : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🚚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-purple-600">
                {Array.isArray(orders) ? orders.filter(o => o.status === 'delivered').length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Customer</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Car</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Type</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Price</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Status</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Contract</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Date</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(orders) && orders.length > 0 ? orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{order.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={order.car?.image || '/placeholder-car.jpg'} 
                        alt={order.car?.title || 'Car'} 
                        className="w-12 h-8 object-cover rounded-lg shadow-sm" 
                        onError={(e) => {
                          e.target.src = '/placeholder-car.jpg';
                        }}
                      />
                      <span className="font-medium text-gray-900">{order.car?.title || 'Unknown Car'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.type === 'buy' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.type === 'buy' ? 'Buy' : 'Rent'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-blue-600">
                      ${order.type === 'buy' 
                        ? (order.car?.salePrice || 0).toLocaleString() 
                        : (order.car?.rentPrice || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.contractApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.contractApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpen(order)} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      {!order.contractApproved && (
                        <button 
                          onClick={() => handleApproveContract(order._id)} 
                          className="text-green-600 hover:text-green-800 font-medium text-sm hover:underline transition-colors"
                        >
                          Approve Contract
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(order._id)} 
                        className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                    {Array.isArray(orders) ? 'No orders found' : 'Loading orders...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button 
              onClick={() => setSelected(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Details</h3>
            
            <div className="space-y-4">
              <div className="mb-2">Customer: <span className="font-semibold">{selected.user?.name || 'Unknown'}</span></div>
              
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={selected.car?.image || '/placeholder-car.jpg'} 
                  alt={selected.car?.title || 'Car'} 
                  className="w-24 h-16 object-cover rounded-lg shadow-sm" 
                  onError={(e) => {
                    e.target.src = '/placeholder-car.jpg';
                  }}
                />
                <div>
                  <div className="font-semibold text-lg">{selected.car?.title || 'Unknown Car'}</div>
                  <div className="text-blue-700 font-bold">
                    ${selected.type === 'buy' 
                      ? (selected.car?.salePrice || 0).toLocaleString() 
                      : (selected.car?.rentPrice || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="mb-2">Type: <span className="font-semibold">{selected.type}</span></div>
                <div className="mb-2">Status: <span className="font-semibold">{selected.status}</span></div>
                <div className="mb-4">Date: <span className="font-semibold">
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'N/A'}
                </span></div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                <select 
                  value={status} 
                  onChange={(e) => handleStatusChange(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
                {status === 'Completed' && !selected.contractApproved && (
                  <div className="text-red-600 text-sm">
                    ⚠️ Contract must be approved before completing the order
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleSave} 
                disabled={loading || (status === 'Completed' && !selected.contractApproved)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 