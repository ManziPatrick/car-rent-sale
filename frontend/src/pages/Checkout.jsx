import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import api from '../services/api';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const car = state?.car;
  const type = state?.type;

  const handleConfirm = async () => {
    if (!car || !user) return;
    setLoading(true);
    setError(null);
    try {
      // Create order
      const orderRes = await api.post('/orders', {
        car: car._id,
        user: user._id,
        type: type === 'buy' ? 'Buy' : 'Rent',
      });
      
      // Send order confirmation email
      try {
        await api.post('/orders/send-confirmation', {
          orderId: orderRes.data._id
        });
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
        // Don't fail the order if email fails
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/account'), 1500);
    } catch (err) {
      setError('Failed to complete order.');
    } finally {
      setLoading(false);
    }
  };

  if (!car || !user) {
    return <div className="text-center py-12 text-red-500">Missing car or user information.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Checkout</h1>
        {/* Car Summary */}
        <div className="flex gap-4 items-center mb-6">
          <img src={car.image} alt={car.title || `${car.brand} ${car.model}`} className="w-32 h-20 object-cover rounded" />
          <div>
            <div className="font-semibold text-lg">{car.title || `${car.brand} ${car.model} (${car.year})`}</div>
            <div className="text-blue-600 font-bold">{car.price}</div>
          </div>
        </div>
        {/* User Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Info</h2>
          <div className="mb-2">Name: <span className="font-medium">{user.name}</span></div>
          <div>Email: <span className="font-medium">{user.email}</span></div>
        </div>
        {/* Contract/Terms */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contract & Terms</h2>
          <div className="text-gray-600 text-sm bg-gray-100 rounded p-4 mb-2">By confirming, you agree to our rental terms and conditions. Please review your contract before proceeding.</div>
        </div>
        {/* Confirm Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleConfirm}
          disabled={loading || success}
        >
          {loading ? 'Processing...' : success ? 'Success! Redirecting...' : 'Confirm & Pay'}
        </button>
        {error && <div className="text-center text-red-500 mt-4">{error}</div>}
        {success && <div className="text-center text-green-500 mt-4">Order confirmed! Check your email for confirmation.</div>}
      </div>
    </div>
  );
};

export default Checkout; 