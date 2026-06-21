const BaseQuestion = require('./BaseQuestion');

// This class inherits from the BaseQuestion class
// and it's forced to override the evaluate method to implement
// unique logic related to the type of question
class MultipleChoiceQuestion extends BaseQuestion {
  constructor(question) {
    super(question);
  }

  // answer: whatever the student submitted (e.g. the chosen option text or id)
  // Should return the marks awarded.
  evaluate(answer) {
    if (answer === this.getCorrectOption().text) {
      return this.getMaxMarks()
    } else {
      return 0
    }
  }
}

module.exports = MultipleChoiceQuestion;
