import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const EditQuiz = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 30,
    totalMarks: 100,
    passingMarks: 50,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/api/quizzes/${id}`);
        const quiz = response.data;
        setFormData({
          title: quiz.title || '',
          description: quiz.description || '',
          startDate: quiz.startDate ? quiz.startDate.slice(0, 16) : '',
          endDate: quiz.endDate ? quiz.endDate.slice(0, 16) : '',
          duration: quiz.duration || 30,
          totalMarks: quiz.totalMarks || 100,
          passingMarks: quiz.passingMarks || 50,
        });
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('Unable to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'totalMarks' || name === 'passingMarks' ? Number(value) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await axiosInstance.put(
        `/api/quizzes/${id}`,
        {
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          duration: formData.duration,
          totalMarks: formData.totalMarks,
          passingMarks: formData.passingMarks,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessage('Quiz updated successfully.');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update quiz.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this quiz? This action cannot be undone.')) return;

    try {
      await axiosInstance.delete(`/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete quiz.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Quiz</h1>
          <p className="text-gray-600 text-lg">Update quiz details or delete the quiz entirely.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
          {message && <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 p-4">{message}</div>}
          {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  min="1"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Marks</label>
                <input
                  type="number"
                  name="passingMarks"
                  min="0"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-200"
              >
                Delete Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
