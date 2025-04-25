import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Skills() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState(() => {
    return resumeInfo?.skills || [{ name: '', rating: 0 }];
  });
  const [hobbiesList, setHobbiesList] = useState(() => {
    return resumeInfo?.hobbies || [""];
  });
  const [loading, setLoading] = useState(false);

  // Update resume context whenever skillsList changes.
  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, skills: skillsList }));
  }, [skillsList, setResumeInfo]);

  // Update resume context whenever hobbiesList changes.
  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, hobbies: hobbiesList }));
  }, [hobbiesList, setResumeInfo]);

  const handleChange = (index, name, value) => {
    const newEntries = [...skillsList];
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList(prev => [
      ...prev,
      { name: '', rating: 0 }
    ]);
  };

  const RemoveSkills = () => {
    setSkillsList(prev => prev.slice(0, -1));
  };

  const handleHobbyChange = (index, value) => {
    const newHobbies = [...hobbiesList];
    newHobbies[index] = value;
    setHobbiesList(newHobbies);
  };

  const addNewHobby = () => {
    setHobbiesList(prev => [...prev, ""]);
  };

  const removeHobby = () => {
    if (hobbiesList.length <= 1) {
      toast.info("At least one hobby is required.");
      return;
    }
    setHobbiesList(prev => prev.slice(0, -1));
  };

  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        skills: skillsList.map(({ id, ...rest }) => rest),
        hobbies: hobbiesList
      },
    };

    try {
      // Use the resumeId from context and update the endpoint if needed
      const response = await fetch(`http://localhost:5000/resume/updateResume/${resumeInfo.resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Details updated!');
      } else {
        toast.error(result.message || 'Error updating details');
      }
    } catch (error) {
      toast.error('Server Error, Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      {/* Hobbies Section */}
      <div className="mb-8">
        <h2 className="font-bold text-lg">Hobbies</h2>
        <p>Add your hobbies</p>
        <div className="mt-4">
          {hobbiesList.map((hobby, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={hobby}
                onChange={(e) => handleHobbyChange(index, e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter a hobby"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={addNewHobby}
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              + Add More Hobby
            </button>
            <button
              onClick={removeHobby}
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              - Remove
            </button>
          </div>
        </div>
      </div>
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 border rounded-lg p-3 items-center"
          >
            <div className="w-1/2">
              <label className="text-xs block mb-1">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, 'rating', v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={AddNewSkills}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            + Add More Skill
          </button>
          <button
            onClick={RemoveSkills}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            - Remove
          </button>
        </div>
      </div>
      
      

      <div className="flex justify-end mt-6">
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

export default Skills;
