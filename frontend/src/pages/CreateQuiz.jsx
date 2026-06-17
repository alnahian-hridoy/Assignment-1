import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const defaultQuestion = {
  questionText: '',
  questionType: 'multiple-choice',
  marks: 1,
  explanation: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
};

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 30,
    totalMarks: 100,
    passingMarks: 50,
  });
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'totalMarks' || name === 'passingMarks' ? Number(value) : value,
    }));
  };

  const handleQuestionChange = (index, name, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, [name]: name === 'marks' ? Number(value) : value }
          : question
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, name, value) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        const updatedOptions = question.options.map((option, oIndex) =>
          oIndex === optionIndex ? { ...option, [name]: name === 'isCorrect' ? value === 'true' : value } : option
        );
        return { ...question, options: updatedOptions };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, JSON.parse(JSON.stringify(defaultQuestion))]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, qIndex) => qIndex !== index));
  };

  const addOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: [...question.options, { text: '', isCorrect: false }],
            }
          : question
      )
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.filter((_, oIndex) => oIndex !== optionIndex),
            }
          : question
      )
    );
  };

  const handleQuestionTypeChange = (index, value) => {
    const defaultOptions =
      value === 'true-false'
        ? [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: false },
          ]
        : [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ];

    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === index
          ? { ...question, questionType: value, options: defaultOptions }
          : question
      )
    );
  };

  const validateQuestions = () => {
    for (const [index, question] of questions.entries()) {
      if (!question.questionText.trim()) {
        setError(`Question ${index + 1} text is required.`);
        return false;
      }
      if (question.marks <= 0) {
        setError(`Question ${index + 1} marks must be greater than zero.`);
        return false;
      }
      if (question.questionType === 'multiple-choice') {
        if (question.options.length < 2) {
          setError(`Question ${index + 1} needs at least 2 options.`);
          return false;
        }
        if (!question.options.some((option) => option.isCorrect)) {
          setError(`Question ${index + 1} needs at least one correct option.`);
          return false;
        }
        if (question.options.some((option) => !option.text.trim())) {
          setError(`Question ${index + 1} cannot have empty option text.`);
          return false;
        }
      }
      if (question.questionType === 'true-false') {
        if (!question.options.some((option) => option.isCorrect)) {
          setError(`Question ${index + 1} needs a correct True/False answer.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!formData.title || !formData.startDate || !formData.endDate) {
      setError('Please fill in the required fields.');
      setLoading(false);
      return;
    }

    if (!validateQuestions()) {
      setLoading(false);
      return;
    }

    try {
      const quizResponse = await axiosInstance.post(
        '/api/quizzes',
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

      const quizId = quizResponse.data._id;
      const questionRequests = questions.map((question) =>
        axiosInstance.post(
          '/api/questions',
          {
            quizId,
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.questionType === 'short-answer' ? [] : question.options,
            marks: question.marks,
            explanation: question.explanation,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
      );

      await Promise.all(questionRequests);
      setMessage('Quiz and questions created successfully! Redirecting to home...');
      setTimeout(() => navigate('/home'), 1300);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a New Quiz</h1>
          <p className="text-gray-600 text-lg">Add both the quiz details and the first questions for your prototype.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
          {message && <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 p-4">{message}</div>}
          {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Describe the quiz objectives"
                />
              </div>
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

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Quiz Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition duration-200"
                >
                  Add Question
                </button>
              </div>

              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-2xl p-6 bg-slate-50">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Question {questionIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                      <textarea
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                        placeholder="Write the question here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select
                        value={question.questionType}
                        onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True / False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                      <input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) => handleQuestionChange(questionIndex, 'marks', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                      <input
                        type="text"
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Optional explanation or feedback"
                      />
                    </div>
                  </div>

                  {(question.questionType === 'multiple-choice' || question.questionType === 'true-false') && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">Options</p>
                        {question.questionType === 'multiple-choice' && (
                          <button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          >
                            Add Option
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-7">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={
                                  question.questionType === 'true-false'
                                    ? option.text
                                    : `Option ${optionIndex + 1}`
                                }
                                disabled={question.questionType === 'true-false'}
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  value="true"
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    setQuestions((prev) =>
                                      prev.map((questionValue, qIndex) => {
                                        if (qIndex !== questionIndex) return questionValue;
                                        return {
                                          ...questionValue,
                                          options: questionValue.options.map((opt, optIndex) => ({
                                            ...opt,
                                            isCorrect: optIndex === optionIndex,
                                          })),
                                        };
                                      })
                                    )
                                  }
                                />
                                Correct
                              </label>
                            </div>
                            {question.questionType === 'multiple-choice' && (
                              <div className="col-span-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating quiz and questions...' : 'Create Quiz with Questions'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
