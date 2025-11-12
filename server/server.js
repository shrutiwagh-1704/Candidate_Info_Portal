import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import candidateRoutes from "./routes/candidateRoute.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/api", (req, res) => {
  res.send("hello");
});

// Candidate routes
app.use("/api/candidate", candidateRoutes);

// Port and DB URI from .env
const PORT = process.env.PORT || 8080;
const MONGO_URI =process.env.MONGO_URI
  

// Start server + connect Mongo
const startServer = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);

    console.log(`Database connected: ${connection.connection.host}`);

    app.listen(PORT, () =>
      console.log(` Server listening on port ${PORT}`)
    );
  } catch (err) {
    console.error(" Database connection failed:", err);
  }
};

startServer();
