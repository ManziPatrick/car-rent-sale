import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
        <img
          src={car.image || (car.images && car.images[0])}
          alt={car.title || `${car.brand} ${car.model}` || 'Car Image'}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-car.jpg';
          }}
        />
        
        {/* Status Badge */}
        {car.status && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              car.status === 'Available' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {car.status}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {car.discount && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{car.discount}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title and Brand */}
        <div className="mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {car.title || `${car.brand} ${car.model} (${car.year})`}
          </h3>
          <p className="text-gray-600 text-sm">
            {car.brand} • {car.model} • {car.year}
          </p>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              ${car.salePrice?.toLocaleString()}
            </span>
            {car.oldPrice && (
              <span className="text-base sm:text-lg line-through text-gray-400">
                ${car.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>
          {car.rentPrice && (
            <p className="text-sm text-gray-600">
              Rent: <span className="font-semibold text-green-600">${car.rentPrice?.toLocaleString()}/day</span>
            </p>
          )}
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 text-sm flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-gray-600 truncate">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 truncate">{car.transmission}</span>
          </div>
          {car.mileage && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600 truncate">{car.mileage?.toLocaleString()} km</span>
            </div>
          )}
          {car.color && (
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: car.color.toLowerCase() }}
              ></div>
              <span className="text-gray-600 truncate">{car.color}</span>
            </div>
          )}
        </div>

        {/* View Details Link */}
        <Link 
          to={`/car/${car._id}`} 
          className="mt-auto text-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-lg"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
};

export default CarCard; 