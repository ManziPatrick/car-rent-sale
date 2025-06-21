import { useState } from 'react';
import CarCard from '../components/CarCard';

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

const Shop = () => {
  const [tab, setTab] = useState('Featured');
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Shop Cars</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
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
      {/* Car List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {cars.map(car => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Shop; 