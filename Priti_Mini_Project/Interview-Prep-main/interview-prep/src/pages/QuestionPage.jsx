import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import QuestionNavigation from "./../components/QuestionPageComponents/QuestionNavigation";
import QuestionDisplay from "./../components/QuestionPageComponents/QuestionDisplay";
import AnswerInput from "./../components/QuestionPageComponents/AnswerInput";
import WebcamSection from "./../components/QuestionPageComponents/WebcamSection";
import { chatSession } from "../../utils/GeminiAIModal";
import Loader from "./../components/Loader";
import moment from "moment";
import { useUser } from "@clerk/clerk-react";

const QuestionPage = () => {
  const { user } = useUser();
  const { mockId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isAnswerInputVisible, setIsAnswerInputVisible] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/interview/${mockId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.jsonMockResp);
        setAnswers(new Array(data.jsonMockResp.length).fill(""));
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [mockId]);


  const saveCurrentAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = typedAnswer;
    setAnswers(updatedAnswers);
  };

  const saveAnswersToBackend = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/interview/${mockId}/answers`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: questions.map((question, index) => ({
              question: question.question,
              answer: answers[index] || "No answer provided",
            })),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save answers");
      }
      const data = await response.json();
      console.log("Answers saved successfully:", data);
      return true;
    } catch (err) {
      console.error("Error saving answers:", err);
      setError(err.message);
      return false;
    }
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTypedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      handleFinishClick();
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setTypedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleDoneClick = () => {
    saveCurrentAnswer();
    setIsAnswerInputVisible(false);
  };

  const handleEditClick = () => {
    setIsAnswerInputVisible(true);
  };

  const handleTypeAnswerClick = () => {
    setIsAnswerInputVisible(true);
  };

  const handleFinishClick = async () => {
    // Ensure the current answer is saved
    saveCurrentAnswer();
  
    // Check for any unanswered questions (empty or whitespace-only answers)
    const hasUnanswered = answers.some((answer) => answer.trim() === "");
    if (hasUnanswered) {
      setShowDialog(true);
      return; // Stop submission until user confirms
    }
  
    // If all questions are answered, proceed with the submission
    setIsSubmitting(true);
    try {
      const success = await saveAnswersToBackend();
      if (success) {
        const feedbackList = await generateFeedback(questions, answers);
        if (feedbackList) {
          const userAnswerSaved = await saveUserAnswerToBackend(mockId, feedbackList, user);
          if (userAnswerSaved) {
            // Optionally mark the interview as submitted
            setIsInterviewSubmitted(true);
            navigate("/feedbackpage", { state: { mockId } });
          }
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  

  const handleDialogConfirm = async () => {
    setIsSubmitting(true);
    try {
      const success = await saveAnswersToBackend();
      if (success) {
        const feedbackList = await generateFeedback(questions, answers);
        if (feedbackList) {
          await saveUserAnswerToBackend(mockId, feedbackList, user);
        }
        setShowDialog(false);
        navigate("/feedbackpage", { state: { mockId } });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  const saveUserAnswerToBackend = async (mockIdRef, feedbackList, user) => {
    try {
      const response = await fetch("http://localhost:5000/interview/saveUserAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockIdRef,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
          answers: feedbackList,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user answers");
      }

      const data = await response.json();
      console.log("User answers saved successfully:", data);
      return true;
    } catch (error) {
      console.error("Error saving user answers:", error);
      return false;
    }
  };

  const generateFeedback = async (questions, answers) => {
    setIsGeneratingFeedback(true);
    try {
      const feedbackList = [];

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i].question;
        const userAnswer = answers[i] || "No answer provided";

        const feedbackPrompt = `
          Question: ${question}
          User Answer: ${userAnswer}
          Depends on question and user answer for given interview question, please give us:
          1. A rating for the answer (out of 10)
          2. Feedback as area of improvement (if any) in just 3-5 lines
          Return the response in JSON format with "rating" and "feedback" fields.
        `;

        const result = await chatSession.sendMessage(feedbackPrompt);

        const mockJsonResp = result.response
          .text()
          .replace("```json", "")
          .replace("```", "");

        try {
          const jsonFeedbackResp = JSON.parse(mockJsonResp);
          feedbackList.push({
            question,
            correctAns: questions[i].answer,
            userAns: userAnswer,
            feedback: jsonFeedbackResp.feedback,
            rating: jsonFeedbackResp.rating.toString(),
          });
        } catch (parseError) {
          console.error("Error parsing feedback response:", parseError);
          feedbackList.push({
            question,
            correctAns: questions[i].answer,
            userAns: userAnswer,
            feedback: "Unable to generate feedback.",
            rating: "N/A",
          });
        }
      }

      return feedbackList;
    } catch (error) {
      console.error("Error generating feedback:", error);
      return null;
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      {(isSubmitting || isGeneratingFeedback) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mx-4 md:mx-auto bg-white shadow-md rounded-lg p-6 max-w-7xl w-full relative">
        <div className="md:w-2/3 w-full">
          <QuestionNavigation
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={(index) => {
              saveCurrentAnswer();
              setCurrentQuestionIndex(index);
              setTypedAnswer(answers[index] || "");
            }}
          />
          <div>
            <QuestionDisplay
              question={questions[currentQuestionIndex]?.question}
              handleTypeAnswerClick={handleTypeAnswerClick}
              setTypedAnswer={setTypedAnswer}
              setIsAnswerInputVisible={setIsAnswerInputVisible}
              isSubmitted={false}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          </div>
          <AnswerInput
            isAnswerInputVisible={isAnswerInputVisible}
            typedAnswer={typedAnswer}
            setTypedAnswer={setTypedAnswer}
            handleDoneClick={handleDoneClick}
            submittedAnswer={answers[currentQuestionIndex]}
            handleEditClick={handleEditClick}
          />
          <div className="flex justify-between mt-6">
            {currentQuestionIndex > 0 && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={handleNext}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
        <WebcamSection />
      </div>
      {showDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Unanswered Questions</h3>
            <p className="mb-4">
              You have some unanswered questions. Are you sure you want to submit?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDialogCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDialogConfirm}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;