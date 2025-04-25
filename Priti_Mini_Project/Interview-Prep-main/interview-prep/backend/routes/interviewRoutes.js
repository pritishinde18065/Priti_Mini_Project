const express = require("express");
const router = express.Router();
const {
  saveInterview,
  getInterview,
  getInterviewQuestions,
  saveAnswers,
  saveUserAnswer,
  getFeedback,
  getUserInterviews,
  deleteInterview
} = require("../controllers/interviewController");


router.get("/userInterviews", getUserInterviews); 

router.delete("/delete/:interviewId", deleteInterview);

// Route to save interview data
router.post("/saveInterview", saveInterview);

// Route to get interview data by mockId
router.get("/:mockId", getInterview);

// Route to get interview questions by mockId
router.get("/:mockId/questions", getInterviewQuestions);

// Route to save answers
router.put("/:mockId/answers", saveAnswers);

// Route to save user answers
router.post("/saveUserAnswer", saveUserAnswer);

// Route to get feedback data
router.get("/feedback/:mockId", getFeedback); 



module.exports = router;