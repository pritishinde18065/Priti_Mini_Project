import React from "react";

const AnswerInput = ({
  isAnswerInputVisible,
  typedAnswer,
  setTypedAnswer,
  handleDoneClick,
  submittedAnswer,
  handleEditClick,
}) => {
  return (
    <>
      {/* Answer Input Section */}
      {isAnswerInputVisible && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Type your answer here..."
            rows="4"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
          ></textarea>
          <button
            onClick={handleDoneClick}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Done
          </button>
        </div>
      )}

      {submittedAnswer && !isAnswerInputVisible && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Your Answer:</h3>
          <p>{submittedAnswer}</p>
          <button
            onClick={handleEditClick}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
          >
            Edit
          </button>
        </div>
      )}
    </>
  );
};

export default AnswerInput;