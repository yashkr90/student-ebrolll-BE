import { User, Session } from "../schema/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRETKEY;

// add user to the data base
export const addUser = async (req, res) => {
  try {
    const { userName, universityID, password } = req.body;
    console.log(universityID);
    // Check if the user already exists
    const existingUser = await User.findOne({ universityID });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      userName,
      universityID,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  insert data into the Session model
export const addSession = async (req, res) => {
  try {
    // Extract the data from the request body
    const { deanID, studentID, startTime, endTime, bookedBy, status } =
      req.body;

    // Create a new session document
    const session = new Session({
      deanID,

      startTime,
      endTime,
      bookedBy,
      status,
    });

    // Save the session to the database
    await session.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// authenticate student and return JWT token
export const authStudent = async (req, res) => {
  const { userName, universityID, password } = req.body;
  const user = await User.findOne({ universityID });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { universityID: universityID, userName: userName },
    secretKey
  );
  res.json({ token });
};

//authentiate dean and return JWT token
export const authDean = async (req, res) => {
  const { userName, universityID, password } = req.body;
  const user = await User.findOne({ universityID });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { universityID: universityID, userName: userName },
    secretKey
  );
  res.json({ token });
};

// get all Available session with the dean
export const getDeanSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      status: "Available",
    }).exec();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({
        message: "No available sessions with the dean on Fridays or Thursdays.",
      });
    }

    // Filter sessions that match the desired criteria
    const filteredSessions = sessions.filter((session) => {
      const sessionDayOfWeek = session.startTime.getUTCDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const sessionHour = session.startTime.getUTCHours(); // Get the hour of the session
      const sessionMinute = session.startTime.getUTCMinutes(); // Get the minute of the session

      // Check if the session is on a Friday (5) or Thursday (4) at 10:00 AM
      console.log(sessionDayOfWeek, sessionHour, sessionMinute);
      return (
        (sessionDayOfWeek === 5 || sessionDayOfWeek === 4) &&
        sessionHour === 10 &&
        sessionMinute === 0
      );
    });

    if (filteredSessions.length === 0) {
      return res.status(404).json({
        message:
          "No available sessions with the dean on Fridays or Thursdays at 10:00 AM.",
      });
    }

    console.log(sessions);

    const formattedSessions = filteredSessions.map((session) => ({
      sessionID: session._id,
      startTime: session.startTime,
      endTime: session.endTime,
    }));

    res.json({ sessions: formattedSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// book slot with dean if the session is available
export const bookSlot = async (req, res) => {
  try {
    const { sessionID } = req.body;
    const studentID = req.user.universityID;
    const studentName = req.user.userName;
    console.log(studentID);

    // Check if the session exists and is available
    const session = await Session.findById(sessionID);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    if (session.status === "Pending") {
      return res.status(400).json({ message: "Session is already booked." });
    }

    // Update the session with student details and set status to 'Pending'
    session.bookedBy[0].universityID = studentID;
    session.bookedBy[0].userName = studentName;
    session.status = "Pending";
    await session.save();

    res.json({ message: "Session booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all Pending session when dean logins
export const getPendingSessions = async (req, res) => {
  try {
    // dean's university ID is stored in req.user
    const deanUniversityID = req.user.universityID;
    console.log(deanUniversityID);
    // Find pending sessions for the dean
    const pendingSessions = await Session.find({
      deanID: deanUniversityID,
      status: "Pending",
    }).exec();

    if (!pendingSessions || pendingSessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending sessions for the dean." });
    }

    // Extract and format relevant session information
    const formattedSessions = pendingSessions.map((session) => {
      // session.booke
      return {
        sessionID: session._id,
        bookedBy: session.bookedBy,
        startTime: session.startTime,
        endTime: session.endTime,
      };
    });

    res.json({ pendingSessions: formattedSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
