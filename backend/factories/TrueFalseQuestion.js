const BaseQuestion = require('./BaseQuestion');

// Concrete product: a true/false question.
// Auto-graded. Like multiple-choice, there is a single correct option
// (the one flagged isCorrect) — typically "True" or "False".
class TrueFalseQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: the student's choice (e.g. "True"/"False" or a boolean)
  // Should return the marks awarded.
  evaluate(answer) {
    if (answer === this.getCorrectOption().text) {
      return this.getMaxMarks()
    } else {
      return 0
    }
  }
}

module.exports = TrueFalseQuestion;
