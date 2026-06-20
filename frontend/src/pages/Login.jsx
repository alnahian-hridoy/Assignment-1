import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/home');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quiz Management Portal</h1>
          <p className="text-gray-600 dark:text-gray-300">Login to access your quizzes</p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Confirm'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or sign in with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 space-y-3">
<button className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
    className="w-5 h-5"
  >
    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 512 248 512 111 512 0 401 0 264S111 16 248 16c66.8 0 122.5 24.5 165.4 64.6l-67 64.6C318.5 118.6 286.7 104 248 104c-73.5 0-133 60.6-133 136s59.5 136 133 136c67.8 0 113.7-38.6 124.6-92.4H248v-76.4h240c2.3 12.8 4 25.5 4 54.6z"/>
  </svg>
  Continue with Google
</button>
<button className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className="w-5 h-5 fill-black"
  >
    <path d="M318.7 268.7c-.2-34.4 15.3-60.4 46.9-79.5-17.5-25.7-43.9-39.9-78.8-42.6-32.5-2.5-67.9 19.1-80.9 19.1-13.8 0-44.7-18.3-73.6-17.8-37.9.5-72.8 22.1-92.3 55.8-39.3 67.9-10 168.3 28.2 223.4 18.7 26.7 40.9 56.7 70.1 55.6 28.2-1.1 38.8-18.1 72.9-18.1 34.1 0 43.6 18.1 73.5 17.6 30.3-.5 49.5-27.6 68.1-54.4 21.5-31.3 30.3-61.6 30.5-63.2-.7-.3-58.4-22.4-58.7-88.5zM256.5 96c15.4-18.7 25.7-44.7 22.9-70-22.2.9-49.1 14.8-64.9 33.2-14.2 16.3-26.6 42.4-23.2 67.4 24.8 1.9 49.8-12.6 65.2-30.6z"/>
  </svg>
  Continue with Apple
</button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 font-semibold hover:text-purple-700">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
