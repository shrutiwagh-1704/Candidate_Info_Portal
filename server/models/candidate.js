// server/models/Candidate.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  positionApplied: {
    type: String,
    required: true,
  },
  currentPosition: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  resumeId: 
  {
    type:mongoose.Schema.Types.ObjectId,
    require:true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId, // GridFS file ID for video
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
