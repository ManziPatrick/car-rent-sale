import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const QuickRegisterModal = ({ open, onClose, action, car }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Register the user
      const registerRes = await axios.post('https://car-rent-sale.onrender.com/api/users/register', {
        name: form.name,
        email: form.email,
        phone: form.phone
      });
      
      // Auto-login the user with the returned token
      if (registerRes.data.token) {
        localStorage.setItem('token', registerRes.data.token);
        // Update auth context
        login(form.email, ''); // We don't have the password, but the token is already set
      }
      
      setSuccess('Account created successfully! Your login credentials have been sent to your email address.');
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
        setForm({ name: '', email: '', phone: '' });
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {action === 'buy' ? 'Buy' : 'Rent'} {car?.brand} {car?.model}
          </h2>
          <p className="text-gray-600">
            Quick registration to proceed with your {action}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </span>
            ) : (
              `Create Account & ${action === 'buy' ? 'Buy' : 'Rent'} Now`
            )}
          </button>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-center">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>You'll be automatically logged in after registration.</p>
        </div>
      </div>
    </div>
  );
};

export default QuickRegisterModal; 