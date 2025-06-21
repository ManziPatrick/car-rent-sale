import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-700">Car Sale</span>
      </div>
      <ul className="flex gap-6 text-gray-700 font-medium">
        <li><NavLink to="/" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>Home</NavLink></li>
        <li><NavLink to="/shop" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>Shop</NavLink></li>
        {user && (
          <li><NavLink to="/account" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>My Account</NavLink></li>
        )}
        {user && user.isAdmin && (
          <li><NavLink to="/admin" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>Admin</NavLink></li>
        )}
        {!user ? (
          <>
            <li><NavLink to="/login" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>Login</NavLink></li>
            <li><NavLink to="/register" className={({isActive}) => isActive ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>Register</NavLink></li>
          </>
        ) : (
          <li><button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 