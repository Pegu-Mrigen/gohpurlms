import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import trainerRouter from "./routes/trainerRoute.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

await connectDB().then(() => console.log("first db"));

await connectCloudinary();

app.use(cors());
app.use(clerkMiddleware());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API running.......");
});

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/trainer", express.json(), trainerRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post(
  "/stripe",
  express.raw({
    type: "application/json",
  }),
  stripeWebhooks
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
