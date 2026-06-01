import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [filter]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'upcoming') {
        response = await axiosInstance.get('/api/quizzes/upcoming');
      } else if (filter === 'current') {
        response = await axiosInstance.get('/api/quizzes/current');
      } else if (filter === 'completed') {
        response = await axiosInstance.get('/api/quizzes/completed');
      } else {
        response = await axiosInstance.get('/api/quizzes');
      }
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizStatus = (quiz) => {
    const now = new Date();
    if (now < new Date(quiz.startDate)) return 'upcoming';
    if (now > new Date(quiz.endDate)) return 'completed';
    return 'ongoing';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Management Portal</h1>
          <p className="text-gray-600 text-lg">Welcome back! Choose a quiz to get started.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {['all', 'upcoming', 'current', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition duration-200 ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All Quizzes' : f === 'current' ? 'Ongoing' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading quizzes...</p>
            </div>
          </div>
        )}

        {/* Quiz Cards Grid */}
        {!loading && quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No quizzes available in this category.</p>
          </div>
        )}

        {!loading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              return (
                <div
                  key={quiz._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
                  onClick={() => status === 'ongoing' && navigate(`/quiz/${quiz._id}`)}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold flex-1">{quiz.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{quiz.description}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Quiz Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Marks:</span>
                        <span className="font-semibold text-gray-900">{quiz.totalMarks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Passing Marks:</span>
                        <span className="font-semibold text-gray-900">{quiz.passingMarks || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t pt-4 mb-6">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Starts:</strong> {formatDate(quiz.startDate)} at {formatTime(quiz.startDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Ends:</strong> {formatDate(quiz.endDate)} at {formatTime(quiz.endDate)}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (status === 'ongoing') {
                          navigate(`/quiz/${quiz._id}`);
                        }
                      }}
                      disabled={status !== 'ongoing'}
                      className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                        status === 'ongoing'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {status === 'ongoing' ? 'Take Quiz' : 'View Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
