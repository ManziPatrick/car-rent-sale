import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { carsAPI, ordersAPI } from '../services/api';
import QuickRegisterModal from '../components/QuickRegisterModal';

const car = {
  name: 'Audi R8',
  model: '2023',
  image: '/images/audi-r8.png',
  price: 116000,
  oldPrice: 200000,
  discount: 25,
  description: 'Supercars are generally defined by their engines and the Audi R8 is no different. The 5.2L V-10 engine delivers a blistering 602 horsepower and 413 lb-ft of torque in the AWD drive model while the RWD drive version produces 562 horsepower and 406 lb-ft of torque.',
  warranty: '1 Year Car Sale Brand Warranty',
  returnPolicy: '30 Day Return Policy',
  cashOnDelivery: true,
  colors: ['#ff0000', '#ffa500', '#008000', '#800080', '#0000ff'],
  quantity: 8,
  sku: 'FWM15VKT',
  tags: ['Luxury car sale'],
  features: [
    { label: 'Stand Up', value: '35"L x 24"W x 37-45"H(front to back wheel)' },
    { label: 'Folded (w/o wheels)', value: '32.5"L x 18.5"W x 16.5"H' },
    { label: 'Folded (w/ wheels)', value: '32.5"L x 24"W x 18.5"H' },
    { label: 'Door Pass Through', value: '24' },
    { label: 'Frame', value: 'Aluminum' },
    { label: 'Weight (w/o wheels)', value: '20 LBS' },
    { label: 'Weight Capacity', value: '60 LBS' },
    { label: 'Width', value: '24"' },
    { label: 'Handle height (ground to handle)', value: '37-45"' },
    { label: 'Wheels', value: '12" air / wide track slick tread' },
    { label: 'Seat back height', value: '21.5"' },
    { label: 'Head room (inside canopy)', value: '25"' },
    { label: 'Color', value: 'Black, Blue, Red, White' },
    { label: 'Size', value: '2 seater' },
  ],
  reviews: [
    { user: 'John Doe', rating: 5, comment: 'Amazing car, super fast and comfortable!' },
    { user: 'Jane Smith', rating: 4, comment: 'Great experience, love the design.' },
    { user: 'Alex Brown', rating: 5, comment: 'Worth every penny!' },
  ],
  related: [
    { _id: 1, name: 'BMW X6', image: '/images/bmw-x6.png', price: 138000, oldPrice: 145000, badge: 'Hot', rating: 4 },
    { _id: 2, name: 'Rolls Royces', image: '/images/rolls-royce.png', price: 438000, oldPrice: 445000, badge: 'Hot', rating: 5 },
    { _id: 3, name: 'Mastung', image: '/images/mustang.png', price: 300000, oldPrice: 350000, badge: 'Hot', rating: 4 },
  ],
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedColor, setSelectedColor] = useState(car.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    setLoading(true);
    carsAPI.getById(id)
      .then(res => {
        setCar(res.data);
        setError(null);
      })
      .catch(() => setError('Car not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = (action) => {
    if (!user) {
      setSelectedAction(action);
      setShowRegisterModal(true);
      return;
    }
    handleCheckout(action);
  };

  const handleCheckout = async (action) => {
    if (!car || !user) return;
    
    setCheckoutLoading(true);
    try {
      const orderRes = await ordersAPI.create({
        car: car._id,
        user: user._id,
        type: action,
        status: 'pending'
      });
      
      setCheckoutSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (err) {
      setError('Failed to complete order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading car details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
  
  if (!car) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-8 text-sm text-gray-500">
        Home &gt; Luxurious car &gt; <span className="text-black font-semibold">{car.name}</span>
      </div>
      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Main Image and Thumbnails */}
        <div>
          <img src={car.image} alt={car.name} className="w-full h-96 object-contain rounded-xl mb-6" />
          <div className="flex gap-4 justify-center">
            {[car.image, car.image, car.image].map((img, idx) => (
              <img key={idx} src={img} alt="thumb" className="w-24 h-16 object-contain rounded border" />
            ))}
          </div>
        </div>
        {/* Right: Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
          <div className="mb-2 text-gray-500">Model: <span className="text-blue-700 font-semibold">{car.model}</span></div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-blue-700">${car.price.toLocaleString()}</span>
            <span className="line-through text-gray-400 text-xl">${car.oldPrice.toLocaleString()}</span>
            <span className="text-green-600 font-semibold text-lg">{car.discount}% Off</span>
          </div>
          <p className="text-gray-700 mb-4">{car.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-blue-700"></i> {car.warranty}</span>
            <span className="flex items-center gap-2"><i className="fas fa-undo text-blue-700"></i> {car.returnPolicy}</span>
            {car.cashOnDelivery && <span className="flex items-center gap-2"><i className="fas fa-money-bill text-blue-700"></i> Cash on Delivery available</span>}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Color</span>
            <div className="flex gap-2 mt-2">
              {car.colors.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-blue-700' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={car.quantity}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded mr-2"
            />
            <button className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition">Add to Cart</button>
            <button className="ml-2 text-gray-400 hover:text-blue-700"><i className="far fa-heart"></i></button>
          </div>
          <div className="mb-4 text-gray-500">SKU: <span className="text-black">{car.sku}</span></div>
          <div className="mb-4 text-gray-500">Tags: <span className="text-black">{car.tags.join(', ')}</span></div>
          <div className="mb-4 text-gray-500">Availability: <span className="text-black">{car.quantity} Items In Stock</span></div>
        </div>
      </div>
      {/* Tabs: Additional Info & Reviews */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex gap-8 border-b mb-6">
          <button onClick={() => setTab('info')} className={`pb-2 px-2 font-semibold ${tab === 'info' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-600'}`}>Additional Info</button>
          <button onClick={() => setTab('reviews')} className={`pb-2 px-2 font-semibold ${tab === 'reviews' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-600'}`}>Reviews({car.reviews.length})</button>
        </div>
        {tab === 'info' && (
          <table className="w-full mb-8 text-left">
            <tbody>
              {car.features.map(f => (
                <tr key={f.label} className="border-b">
                  <td className="py-2 pr-4 font-semibold text-gray-700 w-1/3">{f.label}</td>
                  <td className="py-2 text-gray-600">{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'reviews' && (
          <div className="mb-8">
            {car.reviews.map((r, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-50 rounded shadow-sm">
                <div className="font-bold text-blue-700 mb-1">{r.user}</div>
                <div className="flex gap-1 mb-1">
                  {[...Array(r.rating)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
                </div>
                <div className="text-gray-700">{r.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {car.related.map(prod => (
            <div key={prod._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={prod.image} alt={prod.name} className="w-32 h-20 object-contain mb-2" />
              <div className="font-semibold mb-1">{prod.name}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-700 font-bold">${prod.price.toLocaleString()}</span>
                <span className="line-through text-gray-400">${prod.oldPrice.toLocaleString()}</span>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(prod.rating)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
              </div>
              <button className="bg-blue-700 text-white px-4 py-1 rounded font-semibold hover:bg-blue-800 transition">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Register Modal */}
      {showRegisterModal && (
        <QuickRegisterModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          action={selectedAction}
          car={car}
        />
      )}
    </div>
  );
};

export default CarDetails; 