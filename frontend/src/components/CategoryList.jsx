const CategoryList = ({ categories, onSelect, selected }) => (
  <div className="flex gap-4 overflow-x-auto py-2">
    {categories.map(cat => (
      <button
        key={cat._id || cat.name}
        onClick={() => onSelect(cat.name)}
        className={`px-6 py-2 rounded-full shadow text-gray-700 font-semibold whitespace-nowrap ${selected === cat.name ? 'bg-blue-700 text-white' : 'bg-white hover:bg-blue-100'}`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default CategoryList; 