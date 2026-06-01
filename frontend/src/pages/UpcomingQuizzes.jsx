import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const UpcomingQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingQuizzes();
  }, []);

  const fetchUpcomingQuizzes = async () => {
    try {
      const response = await axiosInstance.get('/api/quizzes/upcoming');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching upcoming quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const diff = start - now;

    if (diff < 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Quizzes</h1>
          <p className="text-gray-600 text-lg">Schedule your quiz attempts in advance.</p>
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

        {/* No Quizzes */}
        {!loading && quizzes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No upcoming quizzes at the moment.</p>
          </div>
        )}

        {/* Quizzes List */}
        {!loading && quizzes.length > 0 && (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Quiz Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Starts</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(quiz.startDate)}
                        </p>
                        <p className="text-gray-600">{formatTime(quiz.startDate)}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Ends</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(quiz.endDate)}
                        </p>
                        <p className="text-gray-600">{formatTime(quiz.endDate)}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{quiz.duration} mins</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Time Left</p>
                        <p className="font-semibold text-blue-600">{getTimeUntil(quiz.startDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-200 whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingQuizzes;
