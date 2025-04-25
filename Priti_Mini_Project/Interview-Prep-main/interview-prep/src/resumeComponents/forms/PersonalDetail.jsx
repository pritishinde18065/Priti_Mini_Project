import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No debugging logs
  }, [resumeInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };

  // Validate required fields and correct formats
  const validateForm = () => {
    const { firstName, lastName, jobTitle, address, phone, email, dob } = resumeInfo;
    const errors = [];
    if (!firstName?.trim()) errors.push("First name is required");
    if (!lastName?.trim()) errors.push("Last name is required");
    if (!jobTitle?.trim()) errors.push("Job title is required");
    if (!address?.trim()) errors.push("Address is required");
    if (!phone?.trim()) errors.push("Phone is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!dob) errors.push("Date of Birth is required");

    // Validate that names contain only letters, spaces, apostrophes, and hyphens
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (firstName && !nameRegex.test(firstName)) {
      errors.push("First name can only contain letters, spaces, apostrophes, and hyphens");
    }
    if (lastName && !nameRegex.test(lastName)) {
      errors.push("Last name can only contain letters, spaces, apostrophes, and hyphens");
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.push("Invalid email address");

    // Check phone format: exactly 10 digits and not starting with 0.
    const phoneRegex = /^[1-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.push("Phone number must be exactly 10 digits and not start with 0");
    }

    return errors;
  };

  const onSave = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    const effectiveResumeId = resumeInfo.resumeId;
    if (!effectiveResumeId) {
      toast.error("Resume ID is missing.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/resume/updateResume/${effectiveResumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      const result = await response.json();

      if (response.ok) {
        enabledNext(true);
        toast.success("Details updated");
      } else {
        toast.error(result.message || "Error updating details");
      }
    } catch (error) {
      toast.error("Error updating details");
    } finally {
      setLoading(false);
    }
  };

  // Prepare default value for DOB input (in YYYY-MM-DD format)
  const dobDefaultValue = resumeInfo?.dob
    ? new Date(resumeInfo.dob).toISOString().split("T")[0]
    : '';

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              defaultValue={resumeInfo?.firstName || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              defaultValue={resumeInfo?.lastName || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-1 mt-2 gap-1">
            <label className="text-sm">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              defaultValue={dobDefaultValue}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              defaultValue={resumeInfo?.address || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={resumeInfo?.phone || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              defaultValue={resumeInfo?.email || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default PersonalDetail;
