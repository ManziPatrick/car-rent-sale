import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { carsAPI, categoriesAPI } from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('Featured');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, carsRes] = await Promise.all([
          categoriesAPI.getAll(),
          carsAPI.getAll({ limit: 8 })
        ]);
        setCategories(categoriesRes.data);
        setCars(carsRes.data.cars || carsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredCars = () => {
    switch (tab) {
      case 'Featured':
        return cars.slice(0, 4);
      case 'Popular':
        return cars.filter(car => car.discount > 10).slice(0, 4);
      case 'New added':
        return cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
      default:
        return cars.slice(0, 4);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 pt-12 pb-4 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2 font-semibold">Hot promotions</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-black leading-tight">
            Car Trending <br />
            <span className="text-blue-700">Luxurious Car</span>
          </h1>
          <p className="text-gray-600 mb-6">Save more with coupons & up to 20% off</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/buy-sell" className="bg-blue-700 text-white px-8 py-3 rounded font-semibold shadow hover:bg-blue-800 transition inline-block text-center">
              Buy & Rent Cars
            </Link>
            <Link to="/shop" className="bg-gray-100 text-gray-700 px-8 py-3 rounded font-semibold hover:bg-gray-200 transition inline-block text-center">
              Browse All
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" 
            alt="Hero Car" 
            className="w-full max-w-lg object-contain" 
          />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-blue-700">Popular</span> Categories
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <Link 
              key={category._id} 
              to={`/shop?category=${category._id}`}
              className="flex flex-col items-center min-w-[140px] bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <img 
                src={category.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=200&q=80"} 
                alt={category.name} 
                className="w-24 h-20 object-contain mb-2" 
              />
              <div className="font-semibold text-gray-700 text-sm">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Car Tabs */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="flex gap-2 mb-6">
          {['Featured', 'Popular', 'New added'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded font-semibold ${tab === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} transition`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {getFilteredCars().map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
        {getFilteredCars().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No cars found in this category
          </div>
        )}
      </section>

      {/* Deal of the Day & Luxury Car */}
      <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-100 rounded-xl p-8 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2">Deal of the Day</h3>
          <p className="text-gray-600 mb-4">Limited quantities. End of year Collection.</p>
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" 
            alt="Deal Car" 
            className="w-full h-40 object-contain mb-4" 
          />
          <Link to="/shop" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start">
            Shop Now
          </Link>
        </div>
        <div className="bg-blue-50 rounded-xl p-8 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2">Luxury Car</h3>
          <p className="text-gray-600 mb-4">Try something new on wheels. Limited quantities.</p>
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80" 
            alt="Luxury Car" 
            className="w-full h-40 object-contain mb-4" 
          />
          <Link to="/shop" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 