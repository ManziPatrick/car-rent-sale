import { useState } from 'react';
import CarCard from '../components/CarCard';

const categories = [
  { name: 'RANGE ROVER', image: '/images/range-rover.png' },
  { name: 'BMW', image: '/images/bmw.png' },
  { name: 'ROLLS ROYCE', image: '/images/rolls-royce.png' },
  { name: 'MASTUNG', image: '/images/mustang.png' },
  { name: 'BENZ', image: '/images/benz.png' },
  { name: 'LAMBORGHINI', image: '/images/lamborghini.png' },
];

const cars = [
  { _id: 1, name: 'Red Range Rover', image: '/images/red-range-rover.png', price: 238000, oldPrice: 245000, badge: 'Hot', rating: 5 },
  { _id: 2, name: 'BMW X6', image: '/images/bmw-x6.png', price: 138000, oldPrice: 145000, badge: 'Hot', rating: 4 },
  { _id: 3, name: 'Rolls Royces', image: '/images/rolls-royce.png', price: 438000, oldPrice: 445000, badge: 'Hot', rating: 5 },
  { _id: 4, name: 'Mastung', image: '/images/mustang.png', price: 300000, oldPrice: 350000, badge: 'Hot', rating: 4 },
  { _id: 5, name: 'BENZ X Wagon', image: '/images/benz.png', price: 388000, oldPrice: 390000, badge: '-30%', rating: 5 },
  { _id: 6, name: 'Lamborghini', image: '/images/lamborghini.png', price: 538000, oldPrice: 545000, badge: '-22%', rating: 5 },
  { _id: 7, name: 'Toyota Landcruser', image: '/images/landcruser.png', price: 240000, oldPrice: 245000, badge: 'Hot', rating: 4 },
  { _id: 8, name: 'Audi R8', image: '/images/audi-r8.png', price: 338000, oldPrice: 345000, badge: '', rating: 5 },
];

const Home = () => {
  const [tab, setTab] = useState('Featured');
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
          <a href="/shop" className="bg-blue-700 text-white px-8 py-3 rounded font-semibold shadow hover:bg-blue-800 transition">Shop Now</a>
        </div>
        <div className="flex-1 flex justify-end">
          <img src="/images/hero-car.png" alt="Hero Car" className="w-full max-w-lg object-contain" />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-bold mb-4"><span className="text-blue-700">Popular</span> Categories</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <div key={cat.name} className="flex flex-col items-center min-w-[140px] bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <img src={cat.image} alt={cat.name} className="w-24 h-20 object-contain mb-2" />
              <div className="font-semibold text-gray-700 text-sm">{cat.name}</div>
            </div>
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
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>

      {/* Deal of the Day & Luxury Car */}
      <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-100 rounded-xl p-8 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2">Deal of the Day</h3>
          <p className="text-gray-600 mb-4">Limited quantities. End of year Collection.</p>
          <img src="/images/deal-car.png" alt="Deal Car" className="w-full h-40 object-contain mb-4" />
          <a href="/shop" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start">Shop Now</a>
        </div>
        <div className="bg-blue-50 rounded-xl p-8 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2">Luxury Car</h3>
          <p className="text-gray-600 mb-4">Try something new on wheels. Limited quantities.</p>
          <img src="/images/luxury-car.png" alt="Luxury Car" className="w-full h-40 object-contain mb-4" />
          <a href="/shop" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start">Shop Now</a>
        </div>
      </section>
    </div>
  );
};

export default Home; 