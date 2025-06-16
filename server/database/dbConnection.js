import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URL, {
      dbName: "Job_Portal",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error; 
  }
};

export default dbConnection;
