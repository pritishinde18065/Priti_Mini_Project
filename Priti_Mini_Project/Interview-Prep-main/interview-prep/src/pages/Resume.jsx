import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import { useUser } from "@clerk/clerk-react";
import Header from '../components/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit as EditIcon, Download as DownloadIcon, Trash2 } from 'lucide-react';

const Resume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // State for deletion confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/resume/user/${user?.primaryEmailAddress?.emailAddress}`
        );
        setExistingResumes(response.data);
      } catch (error) {
        toast.error('Failed to load resumes');
      }
    };
    if (user) fetchResumes();
  }, [user]);

  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }
    setLoading(true);
    try {
      const resumeId = uuidv4();
      const response = await axios.post('http://localhost:5000/resume/create', {
        title: resumeTitle,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        resumeId,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.primaryEmailAddress?.emailAddress || ''
      });
      if (response.status === 201) {
        toast.success('Resume created successfully');
        navigate('/resume-builder', { 
          state: { 
            resumeId,
            initialData: response.data 
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create resume');
    } finally {
      setLoading(false);
      setOpenDialog(false);
      setResumeTitle('');
    }
  };

  const handleAction = (action, resume) => {
    switch (action) {
      case 'Edit':
        navigate('/resume-builder', { state: { resumeId: resume.resumeId, initialData: resume } });
        break;
      case 'Download':
        navigate(`/my-resume/${resume.resumeId}/view`);
        break;
      case 'Delete':
        setResumeToDelete(resume.resumeId);
        setShowDeleteConfirmation(true);
        break;
      default:
        break;
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/resume/deleteResume/${resumeToDelete}`);
      if (response.status === 200) {
        toast.success("Resume deleted successfully");
        setExistingResumes(existingResumes.filter(r => r.resumeId !== resumeToDelete));
      }
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setShowDeleteConfirmation(false);
      setResumeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setResumeToDelete(null);
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
          <p className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-900 bg-clip-text text-transparent">
            Start creating your AI-powered resume for your next job role
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => setOpenDialog(true)}
            className="border border-dashed border-gray-400 p-6 rounded-xl hover:shadow-lg hover:shadow-blue-500 transition transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center bg-white"
          >
            <div className="text-4xl text-gray-500">+</div>
            <p className="mt-4 text-sm text-gray-600">New Resume</p>
          </div>
          {existingResumes.map((resume) => (
            <div 
              key={resume.resumeId}
              className="border border-gray-200 p-6 rounded-xl hover:shadow-lg hover:shadow-blue-500 transition transform hover:scale-105 cursor-pointer bg-white relative"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={() => handleAction('Edit', resume)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded" 
                  title="Edit"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleAction('Download', resume)}
                  className="bg-green-500 hover:bg-green-600 text-white p-1 rounded" 
                  title="Download"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleAction('Delete', resume)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center items-center h-48">
                <EditIcon className="w-16 h-16 text-gray-500" />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{resume.title}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Resume Dialog */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Resume</h2>
            <input 
              type="text" 
              value={resumeTitle} 
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="Enter resume title"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end">
              <button 
                onClick={() => setOpenDialog(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateResume}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-sm">
            <p className="mb-4">Are you sure you want to delete this resume?</p>
            <div className="flex justify-end">
              <button 
                onClick={cancelDelete}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resume;
