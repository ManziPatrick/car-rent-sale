import { Link } from 'react-router-dom';
import { useState } from 'react';
import QuickRegisterModal from './QuickRegisterModal';

const CarCard = ({ car }) => {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');

  const handleOpenModal = (type) => {
    setAction(type);
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
        {car.image ? (
          <img src={car.image} alt={car.title} className="object-cover h-full w-full" />
        ) : (
          <span className="text-gray-400">Car Image</span>
        )}
      </div>
      <h4 className="font-bold text-lg mb-1">{car.title}</h4>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-700 font-bold text-xl">${car.salePrice?.toLocaleString()}</span>
        {car.oldPrice && <span className="line-through text-gray-400">${car.oldPrice?.toLocaleString()}</span>}
        {car.discount && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">-{car.discount}%</span>}
      </div>
      {car.status && <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 ${car.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{car.status}</span>}
      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          onClick={() => handleOpenModal('buy')}
        >
          Buy
        </button>
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          onClick={() => handleOpenModal('rent')}
        >
          Rent
        </button>
      </div>
      <Link to={`/car/${car._id}`} className="mt-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition text-center">View Details</Link>
      {showModal && (
        <QuickRegisterModal
          open={showModal}
          onClose={() => setShowModal(false)}
          action={action}
          car={car}
        />
      )}
    </div>
  );
};

export default CarCard; 