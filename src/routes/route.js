import Express  from "express";
import authenticate from "../middlewares/auth.js";
import { addUser,addSession,authDean,authStudent,getDeanSessions,getPendingSessions,bookSlot } from "../controller/controller.js";

const router = Express.Router();

router.post("/add-user", addUser);
router.post("/add-session", addSession);

router.post("/auth/student", authStudent);
router.post("/auth/dean", authDean);

router.get("/dean/sessions", authenticate, getDeanSessions);
router.post("/student/book", authenticate, bookSlot);
router.get("/dean/pending-sessions", authenticate, getPendingSessions);

export default router;
