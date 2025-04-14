import express from "express";
import {
  addCourse,
  getEnrolledStudentsData,
  getTrainerCourses,
  trainerDashboardData,
  updateRoleToTrainer,
} from "../controllers/trainerController.js";
import upload from "../config/multer.js";
import { protectTrainer } from "./../middlewares/authMiddleware.js";

const trainerRouter = express.Router();

trainerRouter.get("/update-role", updateRoleToTrainer);
trainerRouter.post(
  "/add-course",
  upload.single("img"),
  protectTrainer,
  addCourse
);
trainerRouter.get("/courses", protectTrainer, getTrainerCourses);
trainerRouter.get(
  "/enrolled-learners",
  protectTrainer,
  getEnrolledStudentsData
);
trainerRouter.get("/dashboard", protectTrainer, trainerDashboardData);

export default trainerRouter;
