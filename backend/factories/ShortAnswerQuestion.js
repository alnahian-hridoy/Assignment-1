const BaseQuestion = require('./BaseQuestion');

// Concrete product: a short-answer question.
// NOT auto-graded — short-answer questions are stored with no options
// (options: []), so there is no correct answer to compare against.
// These are graded manually by the quiz admin, so evaluate() should
// signal that the answer needs human review rather than returning marks.
class ShortAnswerQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: the student's free-text response (kept for the admin to read)
  // Should NOT auto-award marks — flag it for manual grading instead.
  evaluate(answer) {
    // No correct option to compare against — flag for the admin to grade.
    // Shares the { marks, isCorrect, needsReview } shape; marks stay 0 until graded.
    return { marks: 0, isCorrect: null, needsReview: true };
  }
}

module.exports = ShortAnswerQuestion;
