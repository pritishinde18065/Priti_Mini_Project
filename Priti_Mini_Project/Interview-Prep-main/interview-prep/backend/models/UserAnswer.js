const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema({
    mockIdRef: { type: String, required: true },
    userEmail: { type: String },
    createdAt: { type: String, required: true },
    overallRating: { type: String }, 
    answers: [
      {
        question: { type: String, required: true },
        correctAns: { type: String },
        userAns: { type: String },
        feedback: { type: String },
        rating: { type: String },
      },
    ],
  });
module.exports = mongoose.model("UserAnswer", userAnswerSchema);