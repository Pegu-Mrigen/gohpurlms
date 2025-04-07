import mongoose from "mongoose";
const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected22"));  

  await mongoose.connect(`${process.env.MONGODB_URL}/lmsabcd`);
};

export default connectDB;
