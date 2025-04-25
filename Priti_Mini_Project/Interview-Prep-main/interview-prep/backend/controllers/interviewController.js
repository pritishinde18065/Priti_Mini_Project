const Interview = require("../models/Interview");
const UserAnswer = require("../models/UserAnswer");

exports.saveInterview = async (req, res) => {
  try {
    const {
      mockId,
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
    } = req.body;

    if (!mockId || !jsonMockResp || !jobPosition || !jobDesc || !jobExperience || !createdBy || !createdAt) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newInterview = new Interview({
      mockId,
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
      answers: [] // Initialize empty answers array
    });

    await newInterview.save();
    res.status(201).json({
      message: "Interview data saved successfully",
      mockId: newInterview.mockId,
    });
  } catch (error) {
    console.error("Error saving interview data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInterview = async (req, res) => {
  try {
    const { mockId } = req.params;

    const interview = await Interview.findOne({ mockId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInterviewQuestions = async (req, res) => {
  try {
    const { mockId } = req.params;

    const interview = await Interview.findOne({ mockId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json({
      mockId: interview.mockId,
      questions: interview.jsonMockResp,
    });
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveAnswers = async (req, res) => {
  try {
    const { mockId } = req.params;
    const { answers } = req.body;

    const interview = await Interview.findOneAndUpdate(
      { mockId },
      { $set: { answers } },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json({ 
      message: "Answers saved successfully",
      updatedInterview: interview
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveUserAnswer = async (req, res) => {
  try {
    const { mockIdRef, userEmail, createdAt, answers } = req.body;

    // Calculate the overall rating
    let totalRating = 0;
    answers.forEach((answer) => {
      totalRating += parseFloat(answer.rating || 0); // Ensure rating is a number
    });
    const overallRating = (answers.length > 0 ? (totalRating / answers.length).toFixed(1) : "N/A");

    // Check if an entry already exists for the given mockIdRef and userEmail
    const existingEntry = await UserAnswer.findOne({ mockIdRef, userEmail });

    if (existingEntry) {
      // Update the existing entry
      existingEntry.createdAt = createdAt;
      existingEntry.answers = answers;
      existingEntry.overallRating = overallRating; // Update overall rating
      await existingEntry.save();
      res.status(200).json({ message: "User answers updated successfully" });
    } else {
      // Create a new entry
      const newUserAnswer = new UserAnswer({
        mockIdRef,
        userEmail,
        createdAt,
        answers,
        overallRating, // Include overall rating
      });
      await newUserAnswer.save();
      res.status(201).json({ message: "User answers saved successfully" });
    }
  } catch (error) {
    console.error("Error saving user answers:", error);
    if (error.code === 11000) {
      res.status(409).json({ message: "Duplicate entry detected" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { mockId } = req.params;
    // Fetch the user answers based on mockId
    const userAnswers = await UserAnswer.find({ mockIdRef: mockId });
    if (!userAnswers || userAnswers.length === 0) {
      return res.status(404).json({ message: "Feedback not found!" });
    }

    // Assuming userAnswers is an array with one document per user and mockId combination
    const userAnswer = userAnswers[0];

    // Calculate the overall rating
    let totalRating = 0;
    userAnswer.answers.forEach(answer => {
      totalRating += parseFloat(answer.rating);
    });

    const averageRating = userAnswer.answers.length > 0 ? (totalRating / userAnswer.answers.length).toFixed(1) : "N/A";

    // Format the feedback data
    const feedbackData = {
      overallRating: averageRating,
      questions: userAnswer.answers.map(answer => ({
        question: answer.question,
        userAnswer: answer.userAns,
        correctAnswer: answer.correctAns,
        feedback: answer.feedback,
        rating: answer.rating,
      })),
    };

    res.json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserInterviews = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) {
      return res.status(400).json({ message: "User email is required!" });
    }

    const userAnswers = await UserAnswer.aggregate([
      { $match: { userEmail } },
      {
        $lookup: {
          from: "interviews",
          localField: "mockIdRef",
          foreignField: "mockId",
          as: "interviewDetails",
        },
      },
      { $unwind: { path: "$interviewDetails", preserveNullAndEmptyArrays: true } }, // Allow empty arrays
      {
        $project: {
          _id: 1,
          interviewId: "$interviewDetails._id",
          createdAt: 1,
          answers: 1,
          overallRating: 1,
          jobPosition: "$interviewDetails.jobPosition",
          jobDesc: "$interviewDetails.jobDesc",
          jobExperience: "$interviewDetails.jobExperience",
          mockIdRef: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // ✅ Return empty array instead of 404
    return res.status(200).json(userAnswers.length ? userAnswers : []);
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Find the interview to get the mockId
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    const mockId = interview.mockId; // Get the mockId from the interview

    // Delete the interview from the Interview collection
    await Interview.findByIdAndDelete(interviewId);

    // Delete the corresponding user answers from the UserAnswer collection
    await UserAnswer.deleteMany({ mockIdRef: mockId });

    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};