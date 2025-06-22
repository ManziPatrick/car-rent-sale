import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsAPI, categoriesAPI } from '../services/api';
import CarCard from '../components/CarCard';
import CategoryList from '../components/CategoryList';

const BuySellPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  const [sortBy, setSortBy] = useState('newest');

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort: sortBy,
        ...(selectedCategory && { category: selectedCategory }),
        ...(search && { search })
      };
      
      const response = await carsAPI.getAll(params);
      const carsData = response.data.cars || response.data;
      const paginationData = response.data.pagination || {};
      
      setCars(carsData);
      setPagination(paginationData);
      setError(null);
    } catch (err) {
      setError('Failed to load cars.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCars();
  }, [page, selectedCategory, search, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const getFilteredCars = () => {
    if (activeTab === 'buy') {
      return cars.filter(car => car.salePrice > 0);
    } else {
      return cars.filter(car => car.rentPrice > 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {activeTab === 'buy' ? 'Buy' : 'Rent'} Your Dream Car
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {activeTab === 'buy' 
                ? 'Discover our premium collection of luxury cars available for purchase. Own your dream car today.'
                : 'Experience luxury on wheels with our premium car rental service. Rent your dream car for any occasion.'
              }
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'buy'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🚗 Buy Cars
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'sell'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⏰ Rent Cars
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'buy' ? 'cars to buy' : 'cars to rent'}...`}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6">
            <CategoryList
              categories={categories}
              onSelect={handleCategoryChange}
              selected={selectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getFilteredCars().length} {activeTab === 'buy' ? 'Cars' : 'Cars'} Available
            </h2>
            <p className="text-gray-600">
              {activeTab === 'buy' 
                ? 'Ready to purchase and drive home'
                : 'Available for immediate rental'
              }
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <button className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button className="p-2 rounded bg-blue-100 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {activeTab === 'buy' ? 'cars to buy' : 'cars to rent'}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredCars().length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No {activeTab === 'buy' ? 'cars to buy' : 'cars to rent'} found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or browse all available cars.
                  </p>
                </div>
              ) : (
                getFilteredCars().map(car => (
                  <CarCard key={car._id} car={car} />
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            page === pageNum 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === page - 2 ||
                      pageNum === page + 2
                    ) {
                      return <span key={idx} className="px-2 py-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Results Info */}
            {getFilteredCars().length > 0 && (
              <div className="text-center mt-6 text-gray-600">
                Showing {((page - 1) * 12) + 1} to {Math.min(page * 12, pagination.totalItems)} of {pagination.totalItems} cars
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuySellPage; 