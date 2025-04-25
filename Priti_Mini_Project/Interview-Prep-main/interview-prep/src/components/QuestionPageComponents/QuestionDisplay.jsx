import React, { useState } from "react";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import RecordAnswer from "./RecordAnswer";

const QuestionDisplay = ({
  question,
  handleTypeAnswerClick,
  setTypedAnswer, 
  setIsAnswerInputVisible,
  isSubmitted,
  setCurrentQuestionIndex,
}) => {
  const [isRecordingVisible, setIsRecordingVisible] = useState(false);

  const handleRecordAnswerClick = () => {
    setIsRecordingVisible(true);
    setIsAnswerInputVisible(true);
    setTypedAnswer(""); // <-- Clear typed answer when switching to recording
  };

  const handleTypeAnswerClickWrapper = () => {
    setIsRecordingVisible(false); // <-- Hide recording component
    setIsAnswerInputVisible(true);
    setTypedAnswer(""); // <-- Clear recorded answer when switching to typing
    handleTypeAnswerClick(); // <-- Call the original handler
  };

  const moveToNextQuestion = () => {
    setIsRecordingVisible(false); // Hide recording component
    setCurrentQuestionIndex((prev) => prev + 1); // Move to next question
  };

  return (
    <div className="p-6 border-2 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{question}</h2>

      {!isSubmitted && (
        <div className="flex space-x-4">
          {/* Start Recording Answer */}
          <button
            onClick={handleRecordAnswerClick}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            <FaMicrophone /> <span>Answer</span>
          </button>

          {/* Type Answer */}
          <button
            onClick={handleTypeAnswerClickWrapper}
            className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            <FaKeyboard /> <span>Type Answer</span>
          </button>
        </div>
      )}

      {/* Render the Recording Component when needed */}
      {isRecordingVisible && (
        <RecordAnswer
          setTypedAnswer={setTypedAnswer} // <-- Pass setTypedAnswer
          setIsAnswerInputVisible={setIsAnswerInputVisible}
          moveToNextQuestion={moveToNextQuestion}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;