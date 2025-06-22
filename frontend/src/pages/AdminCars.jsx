import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { 
  title: '', 
  brand: '',
  model: '',
  year: '',
  salePrice: '', 
  rentPrice: '',
  images: [],
  description: '', 
  category: '',
  features: '',
  status: 'Available',
  transmission: '',
  mileage: '',
  fuel: '',
  rentedByDriver: 'with'
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgFiles, setImgFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCars, setSelectedCars] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/cars'),
      api.get('/categories')
    ])
      .then(([carRes, catRes]) => {
        // Ensure we always have arrays
        setCars(Array.isArray(carRes.data.cars) ? carRes.data.cars : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setError('Failed to load cars or categories.');
        setCars([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter cars
  const filteredCars = Array.isArray(cars) ? cars.filter(car => {
    const matchesSearch = !search || 
      car.title?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase()) ||
      car.model?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || car.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  // Handle form input
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Handle image upload
  const handleImages = e => {
    const files = Array.from(e.target.files).slice(0, 4); // max 4 images
    setImgFiles(files);
    // Preview images
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgPreviews => {
      setForm({ ...form, images: imgPreviews });
    });
  };

  // Open add/edit form
  const openForm = (car = null) => {
    if (car) {
      setForm({
        title: car.title || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || '',
        salePrice: car.salePrice || '',
        rentPrice: car.rentPrice || '',
        images: car.images || [],
        description: car.description || '',
        category: car.category || '',
        features: car.features ? car.features.join(', ') : '',
        status: car.status || 'Available',
        transmission: car.transmission || '',
        mileage: car.mileage || '',
        fuel: car.fuel || '',
        rentedByDriver: car.rentedByDriver || 'with',
      });
      setEditId(car._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowForm(true);
    setImgFiles([]);
    setError(null);
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(form).forEach(key => {
        if (key === 'features' && form[key]) {
          formData.append(key, form[key].split(',').map(f => f.trim()).filter(f => f).join(','));
        } else if (key === 'salePrice' || key === 'rentPrice') {
          formData.append(key, parseFloat(form[key]) || 0);
        } else if (key === 'year') {
          formData.append(key, parseInt(form[key]) || new Date().getFullYear());
        } else if (key === 'images') {
          // Only append images if no files are selected (for edit mode)
          if (imgFiles.length === 0 && Array.isArray(form[key]) && form[key].length > 0) {
            form[key].forEach((img, idx) => formData.append('images', img));
          }
        } else {
          formData.append(key, form[key]);
        }
      });
      
      // Add image files if selected
      if (imgFiles.length > 0) {
        imgFiles.forEach(file => formData.append('images', file));
      }
      
      if (editId) {
        await api.put(`/cars/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/cars', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      // Refresh list
      const carRes = await api.get('/cars');
      setCars(Array.isArray(carRes.data.cars) ? carRes.data.cars : []);
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      setImgFiles([]);
    } catch (err) {
      console.error('Error saving car:', err);
      setError(err.response?.data?.message || 'Failed to save car.');
    } finally {
      setFormLoading(false);
    }
  };

  // Open delete confirmation
  const openDelete = id => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/cars/${deleteId}`);
      setCars(cars.filter(car => car._id !== deleteId));
      setShowDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting car:', err);
      setError('Failed to delete car.');
    } finally {
      setFormLoading(false);
    }
  };

  // Bulk operations
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCars(currentCars.map(car => car._id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId, checked) => {
    if (checked) {
      setSelectedCars([...selectedCars, carId]);
    } else {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCars.length} cars?`)) return;
    setFormLoading(true);
    try {
      await Promise.all(selectedCars.map(id => api.delete(`/cars/${id}`)));
      setCars(cars.filter(car => !selectedCars.includes(car._id)));
      setSelectedCars([]);
    } catch (err) {
      console.error('Error bulk deleting cars:', err);
      setError('Failed to delete cars.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkCategoryUpdate = async (newCategory) => {
    if (!newCategory) return;
    setFormLoading(true);
    try {
      await Promise.all(selectedCars.map(id => 
        api.put(`/cars/${id}`, { category: newCategory })
      ));
      // Refresh list
      const carRes = await api.get('/cars');
      setCars(Array.isArray(carRes.data.cars) ? carRes.data.cars : []);
      setSelectedCars([]);
    } catch (err) {
      console.error('Error bulk updating cars:', err);
      setError('Failed to update cars.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading cars...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Cars</h2>
        <button 
          onClick={() => openForm()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Car
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {Array.isArray(categories) ? categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          )) : null}
        </select>
      </div>

      {/* Bulk Operations */}
      {selectedCars.length > 0 && (
        <div className="flex gap-2 mb-4 p-4 bg-blue-50 rounded-lg">
          <select 
            onChange={(e) => handleBulkCategoryUpdate(e.target.value)}
            className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Update Category</option>
            {Array.isArray(categories) ? categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            )) : null}
          </select>
          <button 
            onClick={handleBulkDelete} 
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
          >
            Delete Selected ({selectedCars.length})
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Responsive Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="py-4 px-6 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedCars.length === currentCars.length && currentCars.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Image</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Name</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Price</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Category</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Status</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(currentCars) && currentCars.length > 0 ? currentCars.map(car => (
                <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(car._id)}
                      onChange={(e) => handleSelectCar(car._id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <img 
                      src={
                        (Array.isArray(car.images) && car.images.length > 0 && car.images[0]) ||
                        car.image ||
                        '/placeholder-car.jpg'
                      }
                      alt={car.title || 'Car'} 
                      className="w-16 h-12 object-cover rounded-lg shadow-sm" 
                      onError={(e) => {
                        e.target.src = '/placeholder-car.jpg';
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`.trim() || 'No Name'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {car.title ? `${car.brand || ''} ${car.model || ''} ${car.year || ''}`.trim() : ''}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-blue-600">
                      ${(car.salePrice || 0).toLocaleString()}
                    </div>
                    {car.rentPrice && (
                      <div className="text-sm text-green-600">
                        ${car.rentPrice}/day
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {Array.isArray(categories) ? categories.find(c => c._id === car.category)?.name || 'N/A' : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      car.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : car.status === 'Sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => openForm(car)} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openDelete(car._id)} 
                        className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                    {Array.isArray(currentCars) ? 'No cars found' : 'Loading cars...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6">{editId ? 'Edit Car' : 'Add Car'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Car Name" 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                name="brand" 
                value={form.brand} 
                onChange={handleChange} 
                placeholder="Brand" 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                name="model" 
                value={form.model} 
                onChange={handleChange} 
                placeholder="Model" 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                name="year" 
                value={form.year} 
                onChange={handleChange} 
                placeholder="Year" 
                type="number"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                name="salePrice" 
                value={form.salePrice} 
                onChange={handleChange} 
                placeholder="Sale Price" 
                type="number"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                name="rentPrice" 
                value={form.rentPrice} 
                onChange={handleChange} 
                placeholder="Rent Price (per day)" 
                type="number"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <select 
                name="transmission" 
                value={form.transmission} 
                onChange={handleChange} 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <input 
                name="mileage" 
                value={form.mileage} 
                onChange={handleChange} 
                placeholder="Mileage (e.g. 50000)" 
                type="number"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <select 
                name="fuel" 
                value={form.fuel} 
                onChange={handleChange} 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
              </select>
            </div>
            
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) ? categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              )) : null}
            </select>
            
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
            
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Description" 
              rows="3"
              className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            <input 
              name="features" 
              value={form.features} 
              onChange={handleChange} 
              placeholder="Features (comma separated)" 
              className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleImages} 
              className="w-full mt-4" 
            />
            
            {/* Thumbnails (edit mode: support old image string) */}
            {(Array.isArray(form.images) && form.images.length > 0) ? (
              <div className="mt-4 flex gap-2">
                {form.images.slice(0, 4).map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Preview ${idx+1}`} 
                    className="w-24 h-16 object-cover rounded-lg border" 
                  />
                ))}
              </div>
            ) : (form.image ? (
              <div className="mt-4 flex gap-2">
                <img 
                  src={form.image}
                  alt="Preview"
                  className="w-24 h-16 object-cover rounded-lg border"
                />
              </div>
            ) : null)}
            
            {/* Rented by Driver (dropdown) */}
            <div className="mt-4">
              <label htmlFor="rentedByDriver" className="block text-gray-700 mb-1">Rental Type</label>
              <select
                name="rentedByDriver"
                id="rentedByDriver"
                value={form.rentedByDriver}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="with">With Driver</option>
                <option value="without">Without Driver</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {formLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editId ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                editId ? 'Update Car' : 'Add Car'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this car? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleDelete} 
                disabled={formLoading}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                onClick={() => setShowDelete(false)} 
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars; 