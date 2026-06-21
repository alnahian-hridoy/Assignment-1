const express = require('express');
const {
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
} = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/upcoming', getUpcomingQuizzes);
router.get('/current', getCurrentQuizzes);
router.get('/completed', getCompletedQuizzes);
router.get('/:id', getQuizById);
router.post('/', protect, admin, createQuiz);
router.put('/:id', protect, admin, updateQuiz);
router.delete('/:id', protect, admin, deleteQuiz);
router.post('/:id/duplicate', protect, admin, duplicateQuiz);
router.put('/:id/questions', protect, admin, updateQuizQuestions);

module.exports = router;
