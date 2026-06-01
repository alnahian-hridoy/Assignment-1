import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Results = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const resultId = searchParams.get('resultId');

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (resultId && results.length > 0) {
      const result = results.find((r) => r._id === resultId);
      if (result) {
        setSelectedResult(result);
      }
    }
  }, [resultId, results]);

  const fetchResults = async () => {
    try {
      const response = await axiosInstance.get('/api/results/user');
      setResults(response.data);
      if (resultId) {
        const result = response.data.find((r) => r._id === resultId);
        if (result) {
          setSelectedResult(result);
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600 text-lg">View your performance and detailed feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Results</h2>

              {results.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No results yet.</p>
              ) : (
                <div className="space-y-2">
                  {results.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => setSelectedResult(result)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition duration-200 ${
                        selectedResult?._id === result._id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{result.quizId.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(result.completedAt)}</p>
                      <p className={`text-lg font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Result Details */}
          {selectedResult && (
            <div className="lg:col-span-2 space-y-6">
              {/* Score Card */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedResult.quizId.title}</h2>
                  <p className="text-gray-600">{formatDate(selectedResult.completedAt)}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* Score Circle */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-2">
                      <span className="text-4xl font-bold text-white">{selectedResult.percentage}%</span>
                    </div>
                    <p className="text-gray-600">Score</p>
                  </div>

                  {/* Grade */}
                  <div className="text-center flex flex-col items-center justify-center">
                    <div className={`text-5xl font-bold mb-2 ${getGrade(selectedResult.percentage).color}`}>
                      {getGrade(selectedResult.percentage).grade}
                    </div>
                    <p className="text-gray-600">Grade</p>
                  </div>

                  {/* Status */}
                  <div className="text-center flex flex-col items-center justify-center">
                    <div className={`text-3xl font-bold mb-2 ${selectedResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedResult.passed ? '✓ Passed' : '✗ Failed'}
                    </div>
                    <p className="text-gray-600">Status</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-6">
                  <div>
                    <p className="text-gray-600 text-sm">Obtained Marks</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedResult.obtainedMarks}/{selectedResult.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Passing Marks</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedResult.quizId.passingMarks || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Time Taken</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(selectedResult.timeTaken)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedResult.quizId.duration}m</p>
                  </div>
                </div>
              </div>

              {/* Answers Review */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Answer Review</h3>

                <div className="space-y-4">
                  {selectedResult.answers.map((answer, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        answer.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-2xl font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {answer.isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">Question {idx + 1}</p>
                          <p className="text-gray-700 mb-2">{answer.questionId?.questionText}</p>
                          <p className={`text-sm font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Your answer: {answer.selectedOption || 'Not answered'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-200"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('/upcoming')}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                >
                  View Upcoming Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
