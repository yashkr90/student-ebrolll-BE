import Connection from "./src/database/db.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Routes from "./src/routes/route.js";

const port = process.env.PORT || 3000;

const app = express();
// app.use(bodyParser.json());
dotenv.config();

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/",Routes);

const MONGOURL = process.env.MONGO_URL;


Connection(MONGOURL).then((res) => {
  console.log(res);
  if (res === "success") {
    app.listen(port || process.env.PORT, () =>
      console.log(`Server is running on PORT ${port}`)
    );
  }
});

// // Define MongoDB models for User and Session
// const User = mongoose.model("User", {
//   userName: String,
//   universityID: String,
//   password: String,
// });

// const Session = mongoose.model("Session", {
//   deanID: String,

//   startTime: Date,
//   endTime: Date,
//   bookedBy: [{ universityID: String, userName: String }],
//   status: String, // Pending or Completed
// });

// // Secret key for JWT
// const secretKey = process.env.SECRETKEY;

// const authenticate = (req, res, next) => {
//   // const bearerHeader=req.header('Authorization');
//   // if(typeof bearerHeader!== 'undefined'){
//   //   const bearerToken=bearerHeader.split(" ")[1];
//   //   console.log(bearerToken);
//   //   req.token=bearerToken;
//   //   next();
//   // } else {
//   //   res.status(400).json({ message: 'Invalid token' });
//   // }

//   const bearerHeader = req.header("Authorization");
//   if (!bearerHeader) return res.status(401).json({ message: "Access denied" });

//   try {
//     const bearerToken = bearerHeader.split(" ")[1];
//     jwt.verify(bearerToken, secretKey, (err, authData) => {
//       if (err) {
//         res.sendStatus(403);
//       } else {
//         console.log(authData);
//         req.user = authData;
//         next();
//       }
//     });

//     // // console.log(token);
//     // const bearerToken=bearerHeader.split(" ")[1];
//     // // console.log(bearerToken);
//     // // req.token=bearerToken;
//     // const decoded = jwt.verify(bearerToken, secretKey);
//     // console.log(decoded);
//     // req.user = decoded;

//     // next();
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: "Invalid token" });
//   }
// };

// // Route to add a new user
// app.post("/add-user", async (req, res) => {
//   try {
//     const { userName, universityID, password } = req.body;
//     console.log(universityID);
//     // Check if the user already exists
//     const existingUser = await User.findOne({ universityID });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the new user
//     const newUser = new User({
//       userName,
//       universityID,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Route to insert data into the Session model
// app.post("/add-sessions", async (req, res) => {
//   try {
//     // Extract the data from the request body
//     const { deanID, studentID, startTime, endTime, bookedBy, status } =
//       req.body;

//     // Create a new session document
//     const session = new Session({
//       deanID,

//       startTime,
//       endTime,
//       bookedBy,
//       status,
//     });

//     // Save the session to the database
//     await session.save();

//     res.status(201).json({ message: "Session created successfully", session });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Routes for student and dean authentication
// app.post("/auth/student", async (req, res) => {
//   const { userName, universityID, password } = req.body;
//   const user = await User.findOne({ universityID });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { universityID: universityID, userName: userName },
//     secretKey
//   );
//   res.json({ token });
// });

// app.post("/auth/dean", async (req, res) => {
//   const { userName, universityID, password } = req.body;
//   const user = await User.findOne({ universityID });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { universityID: universityID, userName: userName },
//     secretKey
//   );
//   res.json({ token });
// });

// // Route to get a list of free sessions available with the dean
// app.get("/dean/sessions", authenticate, async (req, res) => {
//   try {
//     // sessions are stored in a MongoDB collection named 'sessions';
//     // const today = new Date();
//     // const nextFriday = new Date(today);
//     // const nextThursday = new Date(today);

//     // nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
//     // nextThursday.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7));

//     // console.log(nextFriday);
//     // console.log(nextThursday);

//     // nextFriday.setUTCHours(10, 0, 0, 0);
//     // nextThursday.setUTCHours(10, 0, 0, 0);

//     // console.log(nextFriday);
//     // console.log(nextThursday);

//     const sessions = await Session.find({
//       status: "Available",
//     }).exec();

//     if (!sessions || sessions.length === 0) {
//       return res.status(404).json({
//         message: "No available sessions with the dean on Fridays or Thursdays.",
//       });
//     }

//     // Filter sessions that match the desired criteria
//     const filteredSessions = sessions.filter((session) => {
//       const sessionDayOfWeek = session.startTime.getUTCDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//       const sessionHour = session.startTime.getUTCHours(); // Get the hour of the session
//       const sessionMinute = session.startTime.getUTCMinutes(); // Get the minute of the session

//       // Check if the session is on a Friday (5) or Thursday (4) at 10:00 AM
//       console.log(sessionDayOfWeek, sessionHour, sessionMinute);
//       return (
//         (sessionDayOfWeek === 5 || sessionDayOfWeek === 4) &&
//         sessionHour === 10 &&
//         sessionMinute === 0
//       );
//     });

//     if (filteredSessions.length === 0) {
//       return res.status(404).json({
//         message:
//           "No available sessions with the dean on Fridays or Thursdays at 10:00 AM.",
//       });
//     }

//     console.log(sessions);

//     // if (!sessions || sessions.length === 0) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "No available sessions with the dean." });
//     // }

//     // Extract and format relevant session information
//     const formattedSessions = filteredSessions.map((session) => ({
//       sessionID: session._id,
//       startTime: session.startTime,
//       endTime: session.endTime,
//     }));

//     res.json({ sessions: formattedSessions });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Route to book a session by a student
// app.post("/student/book", authenticate, async (req, res) => {
//   try {
//     const { sessionID } = req.body;
//     const studentID = req.user.universityID;
//     const studentName = req.user.userName;
//     console.log(studentID);

//     // Check if the session exists and is available
//     const session = await Session.findById(sessionID);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found." });
//     }

//     if (session.status === "Pending") {
//       return res.status(400).json({ message: "Session is already booked." });
//     }

//     // Update the session with student details and set status to 'Pending'
//     session.bookedBy[0].universityID = studentID;
//     session.bookedBy[0].userName = studentName;
//     session.status = "Pending";
//     await session.save();

//     res.json({ message: "Session booked successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.get("/dean/pending-sessions", authenticate, async (req, res) => {
//   try {
//     // dean's university ID is stored in req.user
//     const deanUniversityID = req.user.universityID;
//     console.log(deanUniversityID);
//     // Find pending sessions for the dean
//     const pendingSessions = await Session.find({
//       deanID: deanUniversityID,
//       status: "Pending",
//     }).exec();

//     if (!pendingSessions || pendingSessions.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No pending sessions for the dean." });
//     }

//     // Extract and format relevant session information
//     const formattedSessions = pendingSessions.map((session) => {
//       // session.booke
//       return {
//         sessionID: session._id,
//         bookedBy: session.bookedBy,
//         startTime: session.startTime,
//         endTime: session.endTime,
//       };
//     });

//     res.json({ pendingSessions: formattedSessions });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
