const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming quizzes
const getUpcomingQuizzes = async (req, res) => {
  try {
    const currentDate = new Date();
    const quizzes = await Quiz.find({ startDate: { $gt: currentDate } })
      .populate('questions')
      .sort({ startDate: 1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current/ongoing quizzes
const getCurrentQuizzes = async (req, res) => {
  try {
    const currentDate = new Date();
    const quizzes = await Quiz.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get completed quizzes
const getCompletedQuizzes = async (req, res) => {
  try {
    const currentDate = new Date();
    const quizzes = await Quiz.find({ endDate: { $lt: currentDate } })
      .populate('questions')
      .sort({ endDate: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single quiz
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create quiz
const createQuiz = async (req, res) => {
  const { title, description, startDate, endDate, duration, totalMarks, passingMarks } = req.body;
  try {
    const quiz = await Quiz.create({
      title,
      description,
      createdBy: req.user.id,
      startDate,
      endDate,
      duration,
      totalMarks,
      passingMarks,
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    Object.assign(quiz, req.body);
    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    await Question.deleteMany({ quizId: req.params.id });
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  getUpcomingQuizzes,
  getCurrentQuizzes,
  getCompletedQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
