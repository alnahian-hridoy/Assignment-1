const express = require('express');
const {
  getUserResults,
  getQuizResults,
  getResultById,
  submitQuiz,
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/user', protect, getUserResults);
router.get('/quiz/:quizId', getQuizResults);
router.get('/:id', getResultById);
router.post('/submit', protect, submitQuiz);

module.exports = router;
