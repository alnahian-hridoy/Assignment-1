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

module.exports = router;
