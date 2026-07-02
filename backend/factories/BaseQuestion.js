// This represents the abstraction for the factory pattern
// Each question object will have its own data and will be 
// read through methods

// Abstract base class for all question types
  class BaseQuestion {
    constructor(question) {
      // Store the question data
      this.questionText = question.questionText;
      this.options = question.options || [];
      this.marks = question.marks || 0;
      this.questionType = question.questionType;
    }

    // Shared concrete behaviour
    getMaxMarks() {
      return this.marks;
    }

    // Helper: the option flagged as correct
    getCorrectOption() {
      return this.options.find((opt) => opt.isCorrect);
    }

    // Abstract method — every subclass must override this or shhow an error
    evaluate(answer) {
      throw new Error('evaluate() must be implemented by subclass');
    }
  }

module.exports = BaseQuestion;