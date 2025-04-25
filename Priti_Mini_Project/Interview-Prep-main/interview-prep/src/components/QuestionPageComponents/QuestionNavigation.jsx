import React from 'react';

const QuestionNavigation = ({ questions, currentQuestionIndex, setCurrentQuestionIndex }) => {
  return (
    <div className="flex flex-wrap justify-start mb-6">
      {questions.map((_, index) => (
        <button
          key={index}
          className={`px-4 py-2 m-1 rounded-full border-2 ${
            currentQuestionIndex === index
              ? "bg-green-500 text-white"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onClick={() => setCurrentQuestionIndex(index)}
        >
          #Question {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigation;
