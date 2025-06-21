import { useState, useEffect } from 'react';
import { adminAPI, ordersAPI } from '../services/api';
import AdminCars from './AdminCars';
import AdminCategories from './AdminCategories';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminNotifications from './AdminNotifications';

const SIDEBAR = [
  { key: 'dashboard', label: 'Overview' },
  { key: 'cars', label: 'Cars' },
  { key: 'categories', label: 'Categories' },
  { key: 'users', label: 'Users' },
  { key: 'orders', label: 'Orders' },
  { key: 'notifications', label: 'Notifications' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({ cars: 0, users: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === 'dashboard') {
      setLoading(true);
      Promise.all([
        adminAPI.getStats(),
        ordersAPI.getAll({ limit: 5, sort: '-createdAt' })
      ])
        .then(([statsRes, ordersRes]) => {
          setStats(statsRes.data);
          // Handle different possible response structures
          const orders = ordersRes.data?.orders || ordersRes.data || [];
          setRecentOrders(Array.isArray(orders) ? orders : []);
        })
        .catch((error) => {
          console.error('Error loading dashboard data:', error);
          setStats({ cars: 0, users: 0, orders: 0, revenue: 0 });
          setRecentOrders([]);
        })
        .finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {SIDEBAR.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`text-left px-4 py-2 rounded transition font-semibold ${tab === item.key ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-700'}`}
            >
              {item.label}
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <section className="flex-1 bg-white rounded-lg shadow p-8 min-h-[500px]">
          {tab === 'dashboard' && (
            <div>
              <h1 className="text-4xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{stats.cars}</div>
                  <div className="text-gray-600">Total Cars</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{stats.users}</div>
                  <div className="text-gray-600">Total Users</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{stats.orders}</div>
                  <div className="text-gray-600">Total Orders</div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">${stats.revenue}</div>
                  <div className="text-gray-600">Total Revenue</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
                      recentOrders.map(order => (
                        <div key={order._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <div className="font-semibold">{order.user?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{order.car?.name || 'Unknown Car'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{order.type}</div>
                            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">No recent orders</div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={() => setTab('cars')} className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition">
                    <div className="font-semibold">Add New Car</div>
                    <div className="text-sm opacity-90">Upload car details and images</div>
                  </button>
                  <button onClick={() => setTab('categories')} className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition">
                    <div className="font-semibold">Manage Categories</div>
                    <div className="text-sm opacity-90">Organize car categories</div>
                  </button>
                  <button onClick={() => setTab('orders')} className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition">
                    <div className="font-semibold">View Orders</div>
                    <div className="text-sm opacity-90">Monitor all transactions</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {tab === 'cars' && <AdminCars />}
          {tab === 'categories' && <AdminCategories />}
          {tab === 'users' && <AdminUsers />}
          {tab === 'orders' && <AdminOrders />}
          {tab === 'notifications' && <AdminNotifications />}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard; 