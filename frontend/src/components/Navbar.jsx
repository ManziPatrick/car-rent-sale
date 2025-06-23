import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setShowMobileMenu(false);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setIsSearchOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="CarLux Logo" className="h-10 w-auto sm:h-12" />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search cars, brands, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/buy-sell" 
              className={({isActive}) => 
                `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Buy & Rent
            </NavLink>
            <NavLink 
              to="/shop" 
              className={({isActive}) => 
                `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => 
                `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => 
                `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right Side - User Menu & Mobile Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Desktop User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block max-w-24 truncate">
                    {user.name || user.email}
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in duration-200">
                    <Link
                      to="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all duration-200 hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200"
            >
              <svg className={`h-6 w-6 transition-transform duration-200 ${showMobileMenu ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search cars, brands, models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 py-3 space-y-1">
            <NavLink 
              to="/" 
              onClick={closeMobileMenu}
              className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/buy-sell" 
              onClick={closeMobileMenu}
              className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Buy & Rent
            </NavLink>
            <NavLink 
              to="/shop" 
              onClick={closeMobileMenu}
              className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={closeMobileMenu}
              className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={closeMobileMenu}
              className={({isActive}) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
            >
              Contact
            </NavLink>

            {/* Mobile Auth Section */}
            {!user && (
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-700 text-white hover:bg-blue-800 transition-all duration-200 text-center"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {user && (
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Signed in as <span className="font-medium text-gray-700">{user.name || user.email}</span>
                </div>
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  My Account
                </Link>
                <Link
                  to="/account/orders"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  My Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;