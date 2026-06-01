const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Get user results
const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('quizId')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz results
const getQuizResults = async (req, res) => {
  try {
    const results = await Result.find({ quizId: req.params.quizId })
      .populate('userId')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single result
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId')
      .populate('userId')
      .populate('answers.questionId');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz
const submitQuiz = async (req, res) => {
  const { quizId, answers, timeTaken } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let obtainedMarks = 0;
    const processedAnswers = [];

    for (let answer of answers) {
      const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
      if (!question) continue;

      const selectedOption = question.options.find((opt) => opt.text === answer.selectedOption);
      const isCorrect = selectedOption ? selectedOption.isCorrect : false;

      if (isCorrect) {
        obtainedMarks += question.marks;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
      });
    }

    const percentage = (obtainedMarks / quiz.totalMarks) * 100;
    const passed = obtainedMarks >= (quiz.passingMarks || 0);

    const result = await Result.create({
      quizId,
      userId: req.user.id,
      answers: processedAnswers,
      obtainedMarks,
      totalMarks: quiz.totalMarks,
      percentage: Math.round(percentage),
      passed,
      completedAt: new Date(),
      timeTaken,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUserResults,
  getQuizResults,
  getResultById,
  submitQuiz,
};
