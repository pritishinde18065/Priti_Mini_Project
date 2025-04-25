import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
// Use the correct icon export from lucide-react
import { Camera } from "lucide-react"; 
import Webcam from "react-webcam"; 
import { FaVideo } from "react-icons/fa"; // (Optional)

const InterviewPage = () => {
  const { mockId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [webcamSupported, setWebcamSupported] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/interview/${mockId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interview data");
        }
        const data = await response.json();
        setInterviewData(data);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();

    // Check if the browser supports webcam access
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setWebcamSupported(false);
    }
  }, [mockId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 mt-10 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex flex-col items-center">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="max-w-7xl w-full bg-white shadow-xl rounded-xl p-8 my-10 mx-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section - Interview Details */}
          <div className="md:w-2/3 w-full">
            <h2 className="text-2xl font-bold text-gray-800">
              Let’s Get Started
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              <strong>Job Role / Position:</strong> {interviewData.jobPosition}
            </p>
            <p className="mt-2 text-lg text-gray-700">
              <strong>Job Description / Tech Stack:</strong> {interviewData.jobDesc}
            </p>
            <p className="mt-2 text-lg text-gray-700">
              <strong>Years of Experience:</strong> {interviewData.jobExperience}
            </p>
            <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="text-yellow-800 font-semibold">Information</h3>
              <p className="mt-2 text-yellow-700">
                Enable your Video Webcam and Microphone to start your AI Generated
                mock interview. You will answer 5 questions and receive a report
                based on your answers.
              </p>
              <p className="mt-2 text-yellow-700">
                <strong>NOTE:</strong> Your webcam video is recorded locally in your
                browser and is never stored on our servers. You have full control
                over your recording and can download or discard it at any time.
              </p>
            </div>
          </div>

          {/* Right Section - Webcam Area */}
          <div className="md:w-1/3 w-full flex flex-col items-center">
            {webcamSupported ? (
              <>
                <div
                  className="hidden md:flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ width: 300, height: 200 }}
                >
                  {webcamEnabled ? (
                    <Webcam
                      className="rounded-xl"
                      style={{ width: "100%", height: "100%" }}
                      mirrored={false}
                      videoConstraints={{ facingMode: "user" }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-50">
                      <Camera size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-6 rounded-full transition-transform duration-300 transform hover:scale-105"
                  onClick={() => setWebcamEnabled((prev) => !prev)}
                >
                  {webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
                </button>
              </>
            ) : (
              <div className="hidden md:block text-red-500 mt-6">
                Webcam is not supported on this device.
              </div>
            )}

            {/* Start Interview Button */}
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold mt-10 py-3 px-6 rounded-xl shadow-lg transition-colors duration-300"
              onClick={() => navigate(`/interview/${mockId}/questions`)}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
