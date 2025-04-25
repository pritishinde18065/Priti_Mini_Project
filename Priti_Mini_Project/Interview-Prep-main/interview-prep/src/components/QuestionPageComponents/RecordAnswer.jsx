import React, { useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";

const RecordAnswer = ({ setTypedAnswer, setIsAnswerInputVisible }) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      setTypedAnswer(results.map((result) => result.transcript).join(" ")); // <-- Update typedAnswer
      setIsAnswerInputVisible(true); // Show the answer input
    }
  }, [results, setTypedAnswer, setIsAnswerInputVisible]);

  if (error) return <p className="text-red-500">Speech recognition is not supported in this browser.</p>;

  return (
    <div className="mt-4">
      <p className="font-semibold">Recording: {isRecording ? "ON 🎤" : "OFF"}</p>
      <button
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
        className={`mt-2 py-2 px-4 rounded-lg ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p className="mt-2 text-gray-700">{interimResult}</p>
    </div>
  );
};

export default RecordAnswer;