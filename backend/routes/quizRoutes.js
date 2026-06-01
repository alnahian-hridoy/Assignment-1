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
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/upcoming', getUpcomingQuizzes);
router.get('/current', getCurrentQuizzes);
router.get('/completed', getCompletedQuizzes);
router.get('/:id', getQuizById);
router.post('/', protect, createQuiz);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router;
