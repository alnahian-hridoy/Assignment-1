const BaseQuestion = require('./BaseQuestion');

// Concrete product: a short-answer question.
// If a model answer is stored (a single option flagged isCorrect), the response
// is auto-graded with a case-insensitive match. If no model answer is stored
// (legacy/open-ended questions with options: []), it falls back to manual review.
class ShortAnswerQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: the student's free-text response.
  // Returns the shared { marks, isCorrect, needsReview } shape.
  evaluate(answer) {
    const correct = this.getCorrectOption();

    // No model answer to compare against — defer to the admin to grade.
    if (!correct || !correct.text) {
      return { marks: 0, isCorrect: null, needsReview: true };
    }

    const isCorrect =
      String(answer || '').trim().toLowerCase() === correct.text.trim().toLowerCase();
    return {
      marks: isCorrect ? this.getMaxMarks() : 0,
      isCorrect,
      needsReview: false,
    };
  }
}

module.exports = ShortAnswerQuestion;
