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

// Duplicate quiz with all questions
const duplicateQuiz = async (req, res) => {
  try {
    const originalQuiz = await Quiz.findById(req.params.id).populate('questions');
    if (!originalQuiz) return res.status(404).json({ message: 'Quiz not found' });

    // Create new quiz with duplicated data
    const newQuiz = await Quiz.create({
      title: `${originalQuiz.title} (Copy)`,
      description: originalQuiz.description,
      createdBy: req.user.id,
      startDate: originalQuiz.startDate,
      endDate: originalQuiz.endDate,
      duration: originalQuiz.duration,
      totalMarks: originalQuiz.totalMarks,
      passingMarks: originalQuiz.passingMarks,
    });

    // Duplicate all questions
    const questionIds = [];
    for (const question of originalQuiz.questions) {
      const newQuestion = await Question.create({
        quizId: newQuiz._id,
        questionText: question.questionText,
        questionType: question.questionType,
        options: JSON.parse(JSON.stringify(question.options)),
        marks: question.marks,
        explanation: question.explanation,
      });
      questionIds.push(newQuestion._id);
    }

    // Update quiz with question IDs
    newQuiz.questions = questionIds;
    await newQuiz.save();

    const populatedQuiz = await Quiz.findById(newQuiz._id).populate('questions');
    res.status(201).json(populatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quiz questions
const updateQuizQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // Array of questions with updates
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Process each question
    for (const questionData of questions) {
      if (questionData._id) {
        // Update existing question
        await Question.findByIdAndUpdate(
          questionData._id,
          {
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            options: questionData.options,
            marks: questionData.marks,
            explanation: questionData.explanation,
          },
          { new: true }
        );
      } else {
        // Create new question
        const newQuestion = await Question.create({
          quizId,
          questionText: questionData.questionText,
          questionType: questionData.questionType,
          options: questionData.options,
          marks: questionData.marks,
          explanation: questionData.explanation,
        });
        quiz.questions.push(newQuestion._id);
      }
    }

    await quiz.save();
    const updatedQuiz = await Quiz.findById(quizId).populate('questions');
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  duplicateQuiz,
  updateQuizQuestions,
};
