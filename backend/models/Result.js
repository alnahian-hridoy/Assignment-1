const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedOption: { type: String },
      isCorrect: { type: Boolean },
    },
  ],
  obtainedMarks: { type: Number },
  totalMarks: { type: Number },
  percentage: { type: Number },
  passed: { type: Boolean },
  startedAt: { type: Date },
  completedAt: { type: Date },
  timeTaken: { type: Number }, // in seconds
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Result', resultSchema);
