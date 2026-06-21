const BaseQuestion = require('./BaseQuestion');

// Concrete product: a true/false question.
// Auto-graded. Like multiple-choice, there is a single correct option
// (the one flagged isCorrect) — typically "True" or "False".
class TrueFalseQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: the student's choice (e.g. "True"/"False" or a boolean)
  // Returns { marks, isCorrect, needsReview } so all question types share one shape.
  evaluate(answer) {
    const isCorrect = answer === this.getCorrectOption().text;
    return {
      marks: isCorrect ? this.getMaxMarks() : 0,
      isCorrect,
      needsReview: false,
    };
  }
}

module.exports = TrueFalseQuestion;
