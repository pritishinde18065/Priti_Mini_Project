const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  mockId: { type: String, required: true },
  jsonMockResp: { type: Array, required: true },
  jobPosition: { type: String, required: true },
  jobDesc: { type: String, required: true },
  jobExperience: { type: Number, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: String, required: true },
  answers: { type: Array, default: [] } 
});

module.exports = mongoose.model("Interview", interviewSchema);
