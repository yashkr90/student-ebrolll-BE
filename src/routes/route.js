import { Express } from "express";
import authenticate from "../middlewares/auth";

const router=Express.Router();

router.get("/add-user",addUser);
router.post("/auth/student", authStudent);
router.post("/auth/dean", authDean);
router.get("/dean/sessions",authenticate, getDeanSessions);
router.post("/student/book",authenticate, bookSlot);
router.get("/dean/pending-sessions",authenticate, getPendingSessions);


export default router;