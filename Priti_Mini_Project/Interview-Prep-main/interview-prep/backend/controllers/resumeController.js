const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  try {
    const { title, userEmail, resumeId } = req.body;

    if (!title || !userEmail || !resumeId) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newResume = new Resume({
      title,
      userEmail,
      resumeId
    });

    await newResume.save();
    res.status(201).json({ message: "Resume created successfully", resumeId });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found!" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const updatedData = req.body.data;

        const updatedResume = await Resume.findOneAndUpdate(
            { resumeId: resumeId }, 
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json({ message: 'Resume updated successfully', updatedResume });
    } catch (error) {
        res.status(500).json({ message: 'Error updating resume', error });
    }
};

exports.getResumesByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;  // Get userEmail from URL params
    const resumes = await Resume.find({ userEmail });
    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ message: "No resumes found for this user!" });
    }
    res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes for user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const deletedResume = await Resume.findOneAndDelete({ resumeId });
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
