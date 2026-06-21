const chai = require('chai');
const { expect } = chai;

const QuestionFactory = require('../factories/QuestionFactory');
const BaseQuestion = require('../factories/BaseQuestion');
const MultipleChoiceQuestion = require('../factories/MultipleChoiceQuestion');
const TrueFalseQuestion = require('../factories/TrueFalseQuestion');
const ShortAnswerQuestion = require('../factories/ShortAnswerQuestion');

// Sample question docs shaped like the Question model.
const mcQuestion = {
  questionText: 'Capital of France?',
  questionType: 'multiple-choice',
  marks: 5,
  options: [
    { text: 'Paris', isCorrect: true },
    { text: 'London', isCorrect: false },
  ],
};

const tfQuestion = {
  questionText: 'The sky is blue.',
  questionType: 'true-false',
  marks: 2,
  options: [
    { text: 'True', isCorrect: true },
    { text: 'False', isCorrect: false },
  ],
};

const saQuestion = {
  questionText: 'Explain the factory pattern.',
  questionType: 'short-answer',
  marks: 10,
  options: [], // short-answer stores no options
};

describe('MultipleChoiceQuestion.evaluate', () => {
  it('awards full marks for the correct option', () => {
    const q = new MultipleChoiceQuestion(mcQuestion);
    expect(q.evaluate('Paris')).to.deep.equal({ marks: 5, isCorrect: true, needsReview: false });
  });

  it('awards zero marks for a wrong option', () => {
    const q = new MultipleChoiceQuestion(mcQuestion);
    expect(q.evaluate('London')).to.deep.equal({ marks: 0, isCorrect: false, needsReview: false });
  });
});

describe('TrueFalseQuestion.evaluate', () => {
  it('awards full marks for the correct choice', () => {
    const q = new TrueFalseQuestion(tfQuestion);
    expect(q.evaluate('True')).to.deep.equal({ marks: 2, isCorrect: true, needsReview: false });
  });

  it('awards zero marks for the wrong choice', () => {
    const q = new TrueFalseQuestion(tfQuestion);
    expect(q.evaluate('False')).to.deep.equal({ marks: 0, isCorrect: false, needsReview: false });
  });
});

describe('ShortAnswerQuestion.evaluate', () => {
  it('does not auto-grade and flags for manual review', () => {
    const q = new ShortAnswerQuestion(saQuestion);
    expect(q.evaluate('any text')).to.deep.equal({ marks: 0, isCorrect: null, needsReview: true });
  });
});

describe('QuestionFactory.create', () => {
  it('creates a MultipleChoiceQuestion for "multiple-choice"', () => {
    const q = QuestionFactory.create(mcQuestion);
    expect(q).to.be.instanceOf(MultipleChoiceQuestion);
    expect(q).to.be.instanceOf(BaseQuestion);
  });

  it('creates a TrueFalseQuestion for "true-false"', () => {
    expect(QuestionFactory.create(tfQuestion)).to.be.instanceOf(TrueFalseQuestion);
  });

  it('creates a ShortAnswerQuestion for "short-answer"', () => {
    expect(QuestionFactory.create(saQuestion)).to.be.instanceOf(ShortAnswerQuestion);
  });

  it('throws for an unknown question type', () => {
    expect(() => QuestionFactory.create({ questionType: 'essay' })).to.throw('Unknown question type: essay');
  });
});
