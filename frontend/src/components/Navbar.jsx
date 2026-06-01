import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-purple-200 transition">
            📚 Quiz Portal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/home" className="hover:text-purple-200 transition font-medium">
                  Home
                </Link>
                <Link to="/upcoming" className="hover:text-purple-200 transition font-medium">
                  Upcoming
                </Link>
                <Link to="/results" className="hover:text-purple-200 transition font-medium">
                  Results
                </Link>
                <Link to="/profile" className="hover:text-purple-200 transition font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-purple-200 transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl hover:text-purple-200 transition"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-purple-400 space-y-3">
            {user ? (
              <>
                <Link
                  to="/home"
                  className="block hover:text-purple-200 transition font-medium py-2"
                >
                  Home
                </Link>
                <Link
                  to="/upcoming"
                  className="block hover:text-purple-200 transition font-medium py-2"
                >
                  Upcoming
                </Link>
                <Link
                  to="/results"
                  className="block hover:text-purple-200 transition font-medium py-2"
                >
                  Results
                </Link>
                <Link
                  to="/profile"
                  className="block hover:text-purple-200 transition font-medium py-2"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-purple-200 transition font-medium py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition text-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
