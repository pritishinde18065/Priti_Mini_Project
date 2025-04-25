// ResumeBuilder.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from '../resumeComponents/FormSection';
import ResumePreview from '../resumeComponents/ResumePreview';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ResumeBuilder = () => {
  const location = useLocation();
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const effectiveResumeId = location.state?.resumeId || resumeId;
        if (!effectiveResumeId) {
          toast.error('Invalid resume ID');
          return;
        }

        const response = await axios.get(`http://localhost:5000/resume/${effectiveResumeId}`);
        setResumeInfo({
          ...response.data,
          resumeId: effectiveResumeId
        });
      } catch (error) {
        toast.error('Failed to load resume data');
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.initialData) {
      setResumeInfo(location.state.initialData);
      setLoading(false);
    } else {
      fetchResumeData();
    }
  }, [location.state, resumeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
        <div className="lg:w-1/2 p-6 overflow-y-auto">
          <FormSection />
        </div>
        <div className="lg:w-1/2 p-6 bg-white border-l border-gray-200 overflow-y-auto">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default ResumeBuilder;