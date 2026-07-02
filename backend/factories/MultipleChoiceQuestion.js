const BaseQuestion = require('./BaseQuestion');

// This class inherits from the BaseQuestion class
// and it's forced to override the evaluate method to implement
// unique logic related to the type of question
class MultipleChoiceQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: whatever the student submitted (e.g. the chosen option text or id)
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

module.exports = MultipleChoiceQuestion;
