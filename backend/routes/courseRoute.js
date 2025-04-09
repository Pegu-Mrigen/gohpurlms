import express from "express";
import { getAllCourses, getCoursesById } from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCoursesById);

export default courseRouter;
