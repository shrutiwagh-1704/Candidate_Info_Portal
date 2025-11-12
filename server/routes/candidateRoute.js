import express from "express";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });


async function uploadToGridFS(buffer, filename, bucket) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename);
    uploadStream.end(buffer);
    uploadStream.on("finish", () => resolve(uploadStream.id)); 
    uploadStream.on("error", reject);
  });
}

router.post(
  "/submit",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const { firstName, lastName, positionApplied, currentPosition, experience } =
        req.body;

      let resumeId = null;
      let videoId = null;

      
      if (req.files["resume"] && req.files["resume"][0]) {
        const file = req.files["resume"][0];
        resumeId = await uploadToGridFS(file.buffer, file.originalname, bucket);
      }

      
      if (req.files["video"] && req.files["video"][0]) {
        const file = req.files["video"][0];
        videoId = await uploadToGridFS(file.buffer, file.originalname, bucket);
      }

      
      const candidate = new Candidate({
        firstName,
        lastName,
        positionApplied,
        currentPosition,
        experience,
        resumeId,
        videoId,
      });

      await candidate.save();

      console.log("Candidate saved:", candidate);
      res.status(200).json({ message: "Candidate submitted successfully!" });
    } catch (err) {
      console.error("Error saving candidate:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
