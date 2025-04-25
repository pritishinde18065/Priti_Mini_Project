const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes"); 

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const MONGO_URI =
  "mongodb+srv://admin:fq5it5rrSj4op1GA@cluster0.yuxe1.mongodb.net/mockInterview";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully..!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Use the interview routes
app.use("/interview", interviewRoutes);

// Use the resume routes
app.use("/resume", resumeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});