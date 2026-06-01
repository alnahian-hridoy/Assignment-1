import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const CurrentQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const fetchQuizData = async () => {
    try {
      const quizResponse = await axiosInstance.get(`/api/quizzes/${id}`);
      setQuiz(quizResponse.data);
      setTimeLeft(quizResponse.data.duration * 60);
      setQuestions(quizResponse.data.questions);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedOption) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion]._id]: selectedOption,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const answerArray = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] || null,
    }));

    try {
      const response = await axiosInstance.post('/api/results/submit', {
        quizId: id,
        answers: answerArray,
        timeTaken,
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate(`/results?resultId=${response.data._id}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Quiz not found or no questions available.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-green-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600 text-sm">Time remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.questionText}</h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options && question.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                  answers[question._id] === option.text
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option.text}
                  checked={answers[question._id] === option.text}
                  onChange={() => handleAnswer(option.text)}
                  className="w-4 h-4 text-purple-600 cursor-pointer"
                />
                <span className="ml-4 text-gray-900 font-medium">{option.text}</span>
              </label>
            ))}
          </div>

          {question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            ← Previous
          </button>

          <div className="flex gap-2 flex-wrap">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition duration-200 ${
                  idx === currentQuestion
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : answers[q._id]
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-200"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition duration-200"
            >
              Next →
            </button>
          )}
        </div>

        {/* Submitted Message */}
        {submitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted!</h2>
              <p className="text-gray-600">Redirecting to results...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentQuiz;
