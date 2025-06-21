import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { name: '', price: '', image: '', description: '', category: '', features: '' };

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedCars, setSelectedCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch cars and categories
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/cars'),
      api.get('/categories')
    ])
      .then(([carRes, catRes]) => {
        setCars(carRes.data);
        setCategories(catRes.data);
        setError(null);
      })
      .catch(() => setError('Failed to load cars or categories.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = !search || car.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || car.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImage = e => {
    setImgFile(e.target.files[0]);
  };

  // Open add/edit form
  const openForm = (car = null) => {
    if (car) {
      setForm({
        name: car.name,
        price: car.price,
        image: car.image,
        description: car.description,
        category: car.category,
        features: car.features ? car.features.join(', ') : '',
      });
      setEditId(car._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowForm(true);
    setImgFile(null);
  };

  // Submit add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (imgFile) {
        // Upload image to backend (Cloudinary)
        const data = new FormData();
        data.append('file', imgFile);
        const res = await api.post('/cars/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = res.data.url;
      }
      const payload = {
        ...form,
        image: imageUrl,
        features: form.features.split(',').map(f => f.trim()),
      };
      if (editId) {
        await api.put(`/cars/${editId}`, payload);
      } else {
        await api.post('/cars', payload);
      }
      // Refresh list
      const carRes = await api.get('/cars');
      setCars(carRes.data);
      setShowForm(false);
    } catch {
      setError('Failed to save car.');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const openDelete = id => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/cars/${deleteId}`);
      setCars(cars.filter(car => car._id !== deleteId));
      setShowDelete(false);
    } catch {
      setError('Failed to delete car.');
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await Promise.all(selectedCars.map(id => api.delete(`/cars/${id}`)));
      setCars(cars.filter(car => !selectedCars.includes(car._id)));
      setSelectedCars([]);
    } catch {
      setError('Failed to delete cars.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCategoryUpdate = async (newCategory) => {
    if (!newCategory) return;
    setLoading(true);
    try {
      await Promise.all(selectedCars.map(id => 
        api.put(`/cars/${id}`, { category: newCategory })
      ));
      // Refresh list
      const carRes = await api.get('/cars');
      setCars(carRes.data);
      setSelectedCars([]);
    } catch {
      setError('Failed to update cars.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Cars</h2>
        <button onClick={() => openForm()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Car</button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk Operations */}
      {selectedCars.length > 0 && (
        <div className="flex gap-2 mb-4">
          <select 
            onChange={(e) => handleBulkCategoryUpdate(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            <option value="">Update Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete Selected ({selectedCars.length})
          </button>
        </div>
      )}

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <table className="w-full text-left border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedCars.length === currentCars.length && currentCars.length > 0}
              />
            </th>
            <th className="py-2 px-4">Image</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCars.map(car => (
            <tr key={car._id} className="border-t">
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedCars.includes(car._id)}
                  onChange={(e) => handleSelectCar(car._id, e.target.checked)}
                />
              </td>
              <td className="py-2 px-4"><img src={car.image} alt={car.name} className="w-20 h-12 object-cover rounded" /></td>
              <td className="py-2 px-4">{car.name}</td>
              <td className="py-2 px-4">{car.price}</td>
              <td className="py-2 px-4">{categories.find(c => c._id === car.category)?.name || 'N/A'}</td>
              <td className="py-2 px-4 flex gap-2">
                <button onClick={() => openForm(car)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => openDelete(car._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Car' : 'Add Car'}</h3>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="mb-2 w-full px-3 py-2 border rounded" required />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="mb-2 w-full px-3 py-2 border rounded" required />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="mb-2 w-full px-3 py-2 border rounded" />
            <select name="category" value={form.category} onChange={handleChange} className="mb-2 w-full px-3 py-2 border rounded" required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <input name="features" value={form.features} onChange={handleChange} placeholder="Features (comma separated)" className="mb-2 w-full px-3 py-2 border rounded" />
            <input type="file" accept="image/*" onChange={handleImage} className="mb-2 w-full" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">{editId ? 'Update' : 'Add'} Car</button>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <p className="mb-4">Are you sure you want to delete this car?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
              <button onClick={() => setShowDelete(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars; 