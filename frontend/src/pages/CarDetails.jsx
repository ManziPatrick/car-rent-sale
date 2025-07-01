import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { carsAPI, ordersAPI } from '../services/api';
import QuickRegisterModal from '../components/QuickRegisterModal';
import CarCard from '../components/CarCard';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    const fetchCarAndSimilar = async () => {
      try {
        const [carRes, similarRes] = await Promise.all([
          carsAPI.getById(id),
          carsAPI.getAll({ limit: 4 })
        ]);
        
        setCar(carRes.data);
        
        // Get similar cars (excluding current car)
        const similar = similarRes.data.cars || similarRes.data;
        setSimilarCars(similar.filter(c => c._id !== id).slice(0, 4));
        
        setError(null);
      } catch (err) {
        setError('Car not found.');
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarAndSimilar();
  }, [id]);

  const handleAction = (action) => {
    if (!user) {
      setSelectedAction(action);
      setShowRegisterModal(true);
      return;
    }
    // Navigate to contract page first
    navigate('/contract', {
      state: {
        car,
        type: action
      }
    });
  };

  const handleCheckout = async (action) => {
    if (!car || !user) return;
    
    setCheckoutLoading(true);
    try {
      const orderRes = await ordersAPI.create({
        car: car._id,
        user: user._id,
        type: action === 'buy' ? 'Buy' : 'Rent',
        status: 'Pending'
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

  // Helper function to safely render category
  const renderCategory = (category) => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object' && category.name) return category.name;
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/buy-sell" className="hover:text-blue-600">Cars</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{car.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img 
                src={car.image} 
                alt={car.title} 
                className="w-full h-80 sm:h-96 lg:h-[500px] object-cover" 
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[car.image, car.image, car.image, car.image].map((img, idx) => (
                <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={img} 
                    alt={`${car.title} view ${idx + 1}`} 
                    className="w-full h-20 object-cover cursor-pointer hover:opacity-80 transition" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{car.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{car.brand} • {car.model} • {car.year}</p>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                  ${car.salePrice?.toLocaleString()}
                </span>
                {car.oldPrice && (
                  <span className="text-xl sm:text-2xl line-through text-gray-400">
                    ${car.oldPrice?.toLocaleString()}
                  </span>
                )}
                {car.discount && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{car.discount}% OFF
                  </span>
                )}
              </div>

              {/* Rent Price */}
              {car.rentPrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold">
                    Available for Rent: <span className="text-2xl">${car.rentPrice?.toLocaleString()}</span>/day
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Ready to {activeTab === 'buy' ? 'Own' : 'Experience'} This Car?
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleAction('buy')}
                    disabled={checkoutLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Buy Now - ${car.salePrice?.toLocaleString()}
                      </span>
                    )}
                  </button>
                  
                  {car.rentPrice && (
                    <button 
                      onClick={() => handleAction('rent')}
                      disabled={checkoutLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {checkoutLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Rent - ${car.rentPrice?.toLocaleString()}/day
                        </span>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>Secure payment • Free delivery • 30-day warranty</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{car.year}</div>
                <div className="text-sm text-gray-600">Year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{car.fuel}</div>
                <div className="text-sm text-gray-600">Fuel Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{car.transmission}</div>
                <div className="text-sm text-gray-600">Transmission</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{car.mileage?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Mileage (km)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'features', label: 'Features' },
                  { id: 'reviews', label: 'Reviews' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{car.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand:</span>
                          <span className="font-medium">{car.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{car.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{car.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{car.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${car.status === 'Available' ? 'text-green-600' : 'text-gray-600'}`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Technical Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Type:</span>
                          <span className="font-medium">{car.fuel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-medium">{car.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{renderCategory(car.category)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {car.features && car.features.map((feature, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{feature}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {car.features && car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">★</div>
                    <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Be the first to review this car!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarCars.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Similar Cars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map(similarCar => (
                <CarCard key={similarCar._id} car={similarCar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md mx-4">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your {selectedAction === 'buy' ? 'purchase' : 'rental'} has been confirmed. 
              You'll receive an email confirmation shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Next Steps:</strong><br/>
                • Check your email for order details<br/>
                • Our team will contact you within 24 hours<br/>
                • Track your order in your account
              </p>
            </div>
            <button 
              onClick={() => {
                setCheckoutSuccess(false);
                navigate('/account');
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

      {/* Quick Register Modal */}
      {showRegisterModal && (
        <QuickRegisterModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          action={selectedAction}
        />
      )}
    </div>
  );
};

export default CarDetails; 