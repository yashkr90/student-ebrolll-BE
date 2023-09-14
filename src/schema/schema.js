import mongoose from "mongoose";

// Define MongoDB models for User and Session
const User = mongoose.model("User", {
    userName: String,
    universityID: String,
    password: String,
  });
  
  const Session = mongoose.model("Session", {
    deanID: String,
  
    startTime: Date,
    endTime: Date,
    bookedBy: [{ universityID: String, userName: String }],
    status: String, // Pending or Completed
  });

export {User, Session};