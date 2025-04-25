const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true
  },
  userEmail: { 
    type: String, 
    required: [true, "User email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },
  resumeId: { 
    type: String, 
    required: [true, "Resume ID is required"],
    unique: true,
    index: true
  },
  firstName: { 
    type: String, 
    trim: true,
    default: '' 
  },
  lastName: { 
    type: String, 
    trim: true,
    default: '' 
  },
  jobTitle: { 
    type: String, 
    trim: true,
    default: '' 
  },
  address: { 
    type: String, 
    trim: true,
    default: '' 
  },
  phone: { 
    type: String, 
    match: [/^[1-9]\d{9}$/, "Phone number must be exactly 10 digits and not start with 0"],
    default: '' 
  },
  email: { 
    type: String, 
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    default: '' 
  },
  summary: { 
    type: String, 
    trim: true,
    default: '' 
  },
  experience: {
    type: [{
      // ... experience fields remain the same ...
    }],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Experience exceeds the limit of 10 entries'
    }
  },
  education: {
    type: [{
      // ... education fields remain the same ...
    }],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Education exceeds the limit of 5 entries'
    }
  },
  skills: {
    type: [{
      // ... skills fields remain the same ...
    }],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 20;
      },
      message: 'Skills exceed the limit of 20 entries'
    }
  },
  hobbies: {
    type: [String],
    default: []
  },
  themeColor: {
    type: String,
    default: "#2563eb", 
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code"]
  },
  dob: {
    type: Date,
    // required: [true, "Date of Birth is required"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Resume", resumeSchema);
