import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ThemeToggle = ({ className = '' }) => (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`text-xl hover:text-purple-200 transition ${className}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-purple-200 transition">
            📚 Quiz Portal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/home" className="hover:text-purple-200 transition font-medium">
                  Home
                </Link>
                <Link to="/upcoming" className="hover:text-purple-200 transition font-medium">
                  Upcoming
                </Link>
                {user.role === 'admin' && (
                  <Link to="/create-quiz" className="hover:text-purple-200 transition font-medium">
                    Create Quiz
                  </Link>
                )}
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

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl hover:text-purple-200 transition"
            >
              ☰
            </button>
          </div>
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
                {user.role === 'admin' && (
                  <Link
                    to="/create-quiz"
                    className="block hover:text-purple-200 transition font-medium py-2"
                  >
                    Create Quiz
                  </Link>
                )}
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
