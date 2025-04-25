import React, { useState, useContext } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Summery from './forms/Summary';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeColor from '../resumeComponents/ThemeColor';
import { ResumeInfoContext } from '../context/ResumeInfoContext';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext);
  const effectiveResumeId = resumeInfo?.resumeId || resumeId;

  // Define a common set of button styles using Tailwind CSS
  const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2";

  const handleNextClick = () => {
    if (!enableNext) {
      // Show a toast informing the user to save changes first
      toast.info("Please save your changes before proceeding.");
    } else {
      setActiveFormIndex(activeFormIndex + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-5 items-center">
          <Link to="/resume">
            <button className={buttonClasses}>
              <Home />
            </button>
          </Link>
          {/* Add the ThemeColor button next to Home */}
          <ThemeColor />
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <button
              className={`${buttonClasses} text-sm`}
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft />
            </button>
          )}
          <button
            onClick={handleNextClick}
            // Apply faded styling if not enabled
            className={`${buttonClasses} text-sm ${!enableNext ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next <ArrowRight />
          </button>
        </div>
      </div>

      {/* Form content */}
      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 2 ? (
        <Summery enabledNext={(v) => setEnableNext(v)} />
      ) : activeFormIndex === 3 ? (
        <Experience />
      ) : activeFormIndex === 4 ? (
        <Education />
      ) : activeFormIndex === 5 ? (
        <Skills />
      ) : activeFormIndex === 6 ? (
        <Navigate to={`/my-resume/${effectiveResumeId}/view`} />
      ) : null}
      
      {/* ToastContainer renders the notifications */}
      <ToastContainer />
    </div>
  );
}

export default FormSection;
