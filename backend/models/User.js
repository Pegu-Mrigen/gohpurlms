import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String },
    email: { type: String },
    imageUrl: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
