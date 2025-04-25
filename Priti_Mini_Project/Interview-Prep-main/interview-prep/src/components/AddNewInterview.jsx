import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { chatSession } from "../../utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid"; 
import moment from "moment"; 
import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AddNewInterview = ({ onClose }) => {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [jsonResponse, setJsonResponse] = useState([]);

  const { user } = useUser(); 
  const navigate = useNavigate(); // Initialize navigate

  const handleYearsOfExperienceChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 50) {
      setYearsOfExperience(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    const formData = {
      jobRole,
      jobDescription,
      yearsOfExperience,
    };
  
    const InputPrompt = `Job Position: ${jobRole}, Job Description: ${jobDescription}, Years of Experience: ${yearsOfExperience}. Depend on Job Position, Job Description and Year of Experience. Generate 5 concise interview questions and answers related to the given job position, job description, and years of experience. The answers should be no longer than 2-3 sentences, focusing on key points only. Format the output in JSON, with fields for question and answer.`;
  
    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const mockJsonResp = result.response.text()
        .replace('```json', '')
        .replace('```', '');
      const parsedQuestions = JSON.parse(mockJsonResp);
  
      setJsonResponse(parsedQuestions);
  
      const response = await fetch("http://localhost:5000/interview/saveInterview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockId: uuidv4(), // Generate a unique ID
          jsonMockResp: parsedQuestions,
          jobPosition: jobRole,
          jobDesc: jobDescription,
          jobExperience: yearsOfExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress, // Use Clerk to get the user email
          createdAt: moment().format("DD-MM-yyyy"), // Format the current date
        }),
      });
  
      const data = await response.json();
      console.log("Backend response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
  
      // Redirect user to the interview page with mockId
      if (data.mockId) {
        navigate(`/interview/${data.mockId}`); // Use the returned mockId for redirection
      } else {
        throw new Error("mockId not returned from backend");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to save interview data!");
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] mx-auto p-6">
      {/* Cancel button */}
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
        <FaTimes size={20} />
      </button>

      <div>
        <h2 className="text-xl lg:text-2xl font-medium text-black mb-4">Tell us more about your job interview</h2>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Role/Job Position</label>
            <input
              type="text"
              placeholder="Ex. Full Stack Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description/Tech Stack (In Short)</label>
            <input
              type="text"
              placeholder="Ex. React, Angular, NodeJs, MySql etc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              placeholder="Ex. 5"
              value={yearsOfExperience}
              onChange={handleYearsOfExperienceChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {yearsOfExperience > 50 && (
              <p className="text-red-500 text-sm mt-1">Please enter a realistic value (0-50 years).</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isLoading}>
              {isLoading ? "Processing..." : "Start Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewInterview;
