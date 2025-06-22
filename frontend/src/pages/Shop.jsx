import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsAPI, categoriesAPI } from '../services/api';
import CarCard from '../components/CarCard';
import CategoryList from '../components/CategoryList';

const PAGE_SIZE = 8;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(selectedCategory && { category: selectedCategory }),
        ...(search && { search })
      };
      
      const response = await carsAPI.getAll(params);
      const carsData = response.data.cars || response.data; // Handle both formats
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
  }, [page, selectedCategory, search]);

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

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Shop Cars</h1>
      
      {/* Search & Category Filter */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search cars, brands, models..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CategoryList
            categories={categories}
            onSelect={handleCategoryChange}
            selected={selectedCategory}
          />
        </div>
      </div>

      {/* Car List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {cars.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🚗</div>
                <p>No cars found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              cars.map(car => (
                <CarCard key={car._id} car={car} />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={idx}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded font-semibold transition ${
                        page === pageNum 
                          ? 'bg-blue-700 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          {cars.length > 0 && (
            <div className="text-center mt-4 text-gray-600">
              Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, pagination.totalItems)} of {pagination.totalItems} cars
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop; 