const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="text-7xl font-extrabold text-blue-600 mb-4">404</div>
    <div className="text-2xl font-bold mb-2 text-gray-800">Page Not Found</div>
    <div className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</div>
    <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Go Home</a>
  </div>
);

export default NotFound; 