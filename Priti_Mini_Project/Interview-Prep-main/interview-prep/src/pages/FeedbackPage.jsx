import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState({
    overallRating: "",
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch feedback data from the backend
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const mockId = location.state?.mockId; // Get mockId from location.state
        if (!mockId) {
          throw new Error("Mock ID is required");
        }

        const response = await fetch(`http://localhost:5000/interview/feedback/${mockId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch feedback data");
        }

        const data = await response.json();
        setFeedbackData(data);
      } catch (err) {
        console.error("Error fetching feedback data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [location.state]);

  // Toggle expand/collapse for a question
  const toggleExpand = (index) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((i) => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">
        <p className="text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">Congratulations!</h1>
          <h2 className="text-xl text-center mb-6 text-gray-700">Here is your interview feedback</h2>

          {/* Overall Rating */}
          <div className="bg-blue-100 p-4 rounded-lg mb-6 flex items-center justify-center">
            <Star className="text-yellow-500 mr-2" size={24} />
            <p className="text-lg font-semibold">
              Your overall interview rating:{" "}
              <span className="text-blue-600">{feedbackData.overallRating}</span>
            </p>
          </div>

          {/* Questions and Feedback */}
          <div className="space-y-4">
            {feedbackData.questions.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{question.question}</h3>
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    {expandedQuestions.includes(index) ? (
                      <>
                        <ChevronUp size={20} className="mr-1" /> Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} className="mr-1" /> Expand
                      </>
                    )}
                  </button>
                </div>

                {/* Rating */}
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Star size={16} className="text-yellow-500 mr-1" />
                  <span className="font-semibold">Rating:</span> {question.rating}
                </p>

                {/* Expanded Content */}
                {expandedQuestions.includes(index) && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="font-semibold text-green-700">Your Answer:</p>
                      <p className="text-gray-700">{question.userAnswer}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="font-semibold text-yellow-700">Correct Answer:</p>
                      <p className="text-gray-700">{question.correctAnswer}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="font-semibold text-red-700">Feedback:</p>
                      <p className="text-gray-700">{question.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;