import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Download History
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'Completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status !== 'Completed').length}</p>
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
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Car</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Type</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Price</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Status</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Date</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={order.car?.image || order.car?.images?.[0] || '/placeholder-car.jpg'} 
                        alt={order.car?.title || `${order.car?.brand || ''} ${order.car?.model || ''}` || 'Car'}
                        className="w-16 h-12 object-cover rounded-lg shadow-sm" 
                        onError={(e) => {
                          e.target.src = '/placeholder-car.jpg';
                        }}
                      />
                      <span className="font-medium text-gray-900">
                        {order.car?.title || `${order.car?.brand || ''} ${order.car?.model || ''} ${order.car?.year || ''}`.trim()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.type === 'Buy' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.type === 'Buy' ? 'Buy' : 'Rent'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-blue-600">
                      ${order.type === 'Buy' ? (order.car?.salePrice || 0).toLocaleString() : (order.car?.rentPrice || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : order.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.contractApproved && (
                      <div className="text-xs text-green-600 mt-1">✓ Contract Approved</div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => setSelected(order)} 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
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
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={selected.car?.image} 
                  alt={selected.car?.title} 
                  className="w-24 h-16 object-cover rounded-lg shadow-sm" 
                />
                <div>
                  <div className="font-semibold text-lg">{selected.car?.title}</div>
                  <div className="text-blue-700 font-bold">
                    ${selected.type === 'Buy' ? selected.car?.salePrice?.toLocaleString() : selected.car?.rentPrice?.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="mb-2">Type: <span className="font-semibold">{selected.type}</span></div>
                <div className="mb-2">Status: <span className="font-semibold">{selected.status}</span></div>
                <div className="mb-4">Date: <span className="font-semibold">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelected(null)} 
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button 
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountOrders; 