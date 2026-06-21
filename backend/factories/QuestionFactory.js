const MultipleChoiceQuestion = require('./MultipleChoiceQuestion');
const TrueFalseQuestion = require('./TrueFalseQuestion');
const ShortAnswerQuestion = require('./ShortAnswerQuestion');

// This is the factory class, which returns a concrete
// question object with individual evaluate logic.
class QuestionFactory {
  static create(question) {
    switch (question.questionType) {
      case 'multiple-choice':
        return new MultipleChoiceQuestion(question);
      case 'true-false':
        return new TrueFalseQuestion(question);
      case 'short-answer':
        return new ShortAnswerQuestion(question);
      default:
        throw new Error(`Unknown question type: ${question.questionType}`);
        break;
    }
  }
}

module.exports = QuestionFactory;
