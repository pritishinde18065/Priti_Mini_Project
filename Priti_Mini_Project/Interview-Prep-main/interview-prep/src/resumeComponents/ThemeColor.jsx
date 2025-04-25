import React, { useContext, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function ThemeColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get the resumeId from the resumeInfo context (instead of using useParams)
  const resumeId = resumeInfo?.resumeId;

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    // Update context
    const updatedInfo = { ...resumeInfo, themeColor: color };
    setResumeInfo(updatedInfo);

    // Call the backend API to update the resume with the new theme color
    try {
      const data = { data: { themeColor: color } };
      const response = await axios.put(`http://localhost:5000/resume/updateResume/${resumeId}`, data);
      console.log("Theme color update response:", response);
      toast.success('Theme Color Updated');
    } catch (error) {
      console.error("Error updating theme color:", error);
      toast.error('Error updating theme color');
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="border border-blue-500 text-blue-500 px-3 py-1 rounded inline-flex items-center gap-1"
      >
        <LayoutGrid className="w-4 h-4" /> Theme
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg p-3 z-10">
          <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => onColorSelect(color)}
                className={`h-5 w-5 rounded-full cursor-pointer border ${selectedColor === color ? "border-black" : "border-transparent"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeColor;
