import mongoose from "mongoose";
const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected2"));  

  await mongoose.connect(`${process.env.MONGODB_URL}/gohpurlms`);
};

export default connectDB;
