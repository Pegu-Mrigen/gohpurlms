import express from "express";
import { updateRoleToTrainer } from "../controllers/trainerController.js";

const trainerRouter = express.Router();

trainerRouter.get("/update-role", updateRoleToTrainer);

export default trainerRouter;
