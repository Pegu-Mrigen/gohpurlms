import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB().then(()=>console.log("first db"));

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {

  res.send("API running.......");
});

app.post("/clerk", express.json(), clerkWebhooks);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
