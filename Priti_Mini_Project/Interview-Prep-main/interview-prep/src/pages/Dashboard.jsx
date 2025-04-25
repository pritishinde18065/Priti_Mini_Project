import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import AddNewInterview from "../components/AddNewInterview";
import { useUser } from "@clerk/clerk-react";
import { Rating } from "@smastrom/react-rating";
import { Trash2, Eye, RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [showCard, setShowCard] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserInterviews();
    }
  }, [user]);

  const fetchUserInterviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/interview/userInterviews?userEmail=${encodeURIComponent(
          user?.primaryEmailAddress?.emailAddress
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user interviews");
      }
      const data = await response.json();
      if (data.length === 0) {
        setInterviews([]);
      } else {
        // Only include interviews with answers (i.e. completed)
        const completedInterviews = data.filter(
          (interview) => interview.answers && interview.answers.length > 0
        );
        setInterviews(completedInterviews);
      }
    } catch (err) {
      console.error("Error fetching user interviews:", err);
      setError("An error occurred while fetching interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = (interviewId) => {
    setInterviewToDelete(interviewId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (interviewToDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/interview/delete/${interviewToDelete}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete interview");
        // Refresh the interview list
        await fetchUserInterviews();
        // Replace the current history entry to avoid stale pages via back button
        navigate("/dashboard", { replace: true });
        setShowDeleteConfirmation(false);
      } catch (error) {
        setError("Delete failed. Please try again.");
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setInterviewToDelete(null);
  };

  // Helper function to format date strings from "DD-MM-YYYY" to a proper Date format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Split the date assuming format is DD-MM-YYYY
    const parts = dateString.split("-");
    if (parts.length !== 3) return "Invalid Date";
    const [day, month, year] = parts;
    // Create a new date string in "YYYY-MM-DD" format which is parsable by JS Date
    const formattedDateString = `${year}-${month}-${day}`;
    const dateObj = new Date(formattedDateString);
    return isNaN(dateObj) ? "Invalid Date" : dateObj.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 text-xl font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Start New Interview Section */}
        <section className="bg-gradient-to-bl from-gray-100  to-blue-200 rounded-xl shadow-lg p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              Start a New Interview
            </h2>
            <button
              onClick={() => setShowCard(true)}
              className="mt-4 sm:mt-0 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
            >
              + New Interview
            </button>
          </div>
          {showCard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AddNewInterview onClose={() => setShowCard(false)} />
            </div>
          )}
        </section>

        {/* Previous Interviews Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Previous Interviews
          </h2>
          {interviews.length === 0 ? (
            <div className="text-gray-600 text-center text-lg">
              No previous interviews available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-gray-100 rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl hover:shadow-blue-300 transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {interview.jobPosition}
                    </h3>
                    <div className="flex items-center">
                      {interview.overallRating ? (
                        <Rating
                          style={{ maxWidth: 100 }}
                          value={Number(interview.overallRating)}
                          readOnly
                        />
                      ) : (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          N/A
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    Experience: {interview.jobExperience} years
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Date: {formatDate(interview.createdAt)}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {interview.jobDesc.length > 100
                      ? interview.jobDesc.substring(0, 100) + "..."
                      : interview.jobDesc}
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4">
                    <button
                      onClick={() =>
                        navigate(`/feedbackpage`, {
                          state: { mockId: interview.mockIdRef },
                        })
                      }
                      className="flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors duration-300 flex-1"
                    >
                      <Eye size={16} />
                      <span>Feedback</span>
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/interview/${interview.mockIdRef}/questions`)
                      }
                      className="flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors duration-300 flex-1"
                    >
                      <RefreshCcw size={16} />
                      <span>Retry</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInterview(interview.interviewId);
                      }}
                      className="flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors duration-300 flex-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Delete Interview
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="w-1/2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 ml-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition-colors duration-300"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
