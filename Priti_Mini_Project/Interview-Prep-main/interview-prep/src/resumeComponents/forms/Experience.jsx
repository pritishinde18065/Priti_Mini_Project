import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderCircle, Plus, Minus } from 'lucide-react';

function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const [experienceList, setExperienceList] = useState(() => {
    return resumeInfo && resumeInfo.experience && resumeInfo.experience.length > 0
      ? resumeInfo.experience
      : [
          {
            positionTitle: '',
            companyName: '',
            city: '',
            state: '',
            startDate: '',
            endDate: '',
            workSummary: '',
          },
        ];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, experience: experienceList }));
  }, [experienceList, setResumeInfo]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...experienceList];
    newEntries[index] = { ...newEntries[index], [name]: value };
    setExperienceList(newEntries);
  };

  const handleEditorChange = (index, event) => {
    const newValue = event.target.value;
    const newEntries = [...experienceList];
    newEntries[index] = { ...newEntries[index], workSummary: newValue };
    setExperienceList(newEntries);
  };

  const AddNewExperience = () => {
    const newExperience = {
      positionTitle: '',
      companyName: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      workSummary: '',
    };
    setExperienceList([...experienceList, newExperience]);
  };

  const RemoveExperience = () => {
    if (experienceList.length <= 1) {
      toast.info("At least one experience entry is required.");
      return;
    }
    setExperienceList(experienceList.slice(0, -1));
  };

  // Validate each experience entry
  const validateExperience = () => {
    const errors = [];
    const currentDate = new Date();
    experienceList.forEach((exp, index) => {
      if (!exp.positionTitle.trim()) {
        errors.push(`Experience ${index + 1}: Position Title is required`);
      }
      if (!exp.companyName.trim()) {
        errors.push(`Experience ${index + 1}: Company Name is required`);
      }
      if (!exp.city.trim()) {
        errors.push(`Experience ${index + 1}: City is required`);
      }
      if (!exp.state.trim()) {
        errors.push(`Experience ${index + 1}: State is required`);
      }
      if (!exp.startDate.trim()) {
        errors.push(`Experience ${index + 1}: Start Date is required`);
      }
      if (!exp.workSummary.trim()) {
        errors.push(`Experience ${index + 1}: Work Summary is required`);
      }
      // Check that start and end dates are not in the future
      if (exp.startDate) {
        const startDateObj = new Date(exp.startDate);
        if (startDateObj > currentDate) {
          errors.push(`Experience ${index + 1}: Start Date cannot be in the future`);
        }
      }
      if (exp.endDate) {
        const endDateObj = new Date(exp.endDate);
        if (endDateObj > currentDate) {
          errors.push(`Experience ${index + 1}: End Date cannot be in the future`);
        }
      }
      // If endDate is provided, check that it is not before startDate
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        if (end < start) {
          errors.push(`Experience ${index + 1}: End Date cannot be before Start Date`);
        }
      }
    });
    return errors;
  };

  const onSave = async () => {
    const errors = validateExperience();
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    setLoading(true);
    const data = {
      data: {
        experience: experienceList.map(({ id, ...rest }) => rest),
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5000/resume/updateResume/${resumeInfo.resumeId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success('Details updated!');
      } else {
        toast.error(result.message || 'Error updating details');
      }
    } catch (error) {
      toast.error('Error updating details');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the max attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {/* Position Title */}
              <div>
                <label className="text-xs">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="positionTitle"
                  value={item.positionTitle || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              {/* Company Name */}
              <div>
                <label className="text-xs">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={item.companyName || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              {/* City */}
              <div>
                <label className="text-xs">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={item.city || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              {/* State */}
              <div>
                <label className="text-xs">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={item.state || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              {/* Start Date */}
              <div>
                <label className="text-xs">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={item.startDate || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  required
                  max={today}
                />
              </div>
              {/* End Date */}
              <div>
                <label className="text-xs">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={item.endDate || ''}
                  onChange={(event) => handleChange(index, event)}
                  className="border p-2 rounded w-full"
                  max={today}
                />
              </div>
              {/* Work Summary via RichTextEditor */}
              <div className="col-span-2">
                <label className="text-xs">
                  Work Summary <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  index={index}
                  value={item.workSummary || ''}
                  onRichTextEditorChange={(e) => handleEditorChange(index, e)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={AddNewExperience}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            + Add More Experience
          </button>
          <button
            onClick={RemoveExperience}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            - Remove
          </button>
        </div>
        <button
          disabled={loading}
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Experience;
