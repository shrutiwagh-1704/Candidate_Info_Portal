import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoRecord = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Start camera and show live preview
  const startCamera = async () => {
    setError("");
    setVideoURL("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraOn(true);
    } catch (err) {
      setError("Camera or microphone access denied.");
    }
  };

  // Stop camera manually
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  // Start recording
  const startRecording = async () => {
    if (!streamRef.current) {
      setError("Camera not started!");
      return;
    }
    setError("");
    chunksRef.current = [];
    setRecording(true);
    setTime(0);

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoURL(URL.createObjectURL(blob));
    };

    recorder.start();

    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t >= 90) {
          stopRecording();
          setError("Recording limit exceeded (max 90s).");
          return 90;
        }
        return t + 1;
      });
    }, 1000);
  };

  // Stop recording + stop camera
  const stopRecording = () => {
    if (!recording) return;
    setRecording(false);
    clearInterval(timerRef.current);
    mediaRecorderRef.current.stop();
    stopCamera();
  };

  // Move to Review page with video preview
  const handleSubmit = () => 
  {
    if (!videoURL) {
      setError("Please record a video before submitting.");
      return;
    }

    // Convert the blob to base64 and store it along with existing candidate data
    fetch(videoURL)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Video = reader.result;

          const storedData = localStorage.getItem("candidateData");
          let candidateData = storedData ? JSON.parse(storedData) : {};

          candidateData.videoData = base64Video;
          candidateData.videoName = "introduction.mp4";

          localStorage.setItem("candidateData", JSON.stringify(candidateData));

          navigate("/review");
        };
        reader.readAsDataURL(blob);
      });
  };


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-3">🎥 Video Recording</h2>

      <p>Record a short introduction video (max 90 seconds) covering:</p>
      <ul>
        <li>A brief introduction about yourself</li>
        <li>Why you are interested in this position</li>
        <li>Highlight your relevant experience</li>
        <li>Your long-term career goals</li>
      </ul>

      {error && <p className="text-danger text-center">{error}</p>}

      {/* ===== Layout: Side-by-side Preview & Recorded Video ===== */}
      <div className="row mt-4 align-items-start justify-content-center">
        <div className="col-md-5 text-center">
          <h5>Live Preview</h5>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="border rounded mb-3"
            width="100%"
            height="360"
          ></video>
        </div>

        {videoURL && (
          <div className="col-md-5 text-center">
            <h5>Recorded Video</h5>
            <video src={videoURL} controls className="border rounded mb-3" width="100%" height="360"></video>
          </div>
        )}
      </div>

      {/* ===== Control Buttons ===== */}
      <div className="d-flex justify-content-center gap-3 mt-3">
        {!cameraOn && (
          <button className="btn btn-primary" onClick={startCamera}>
            Start Camera
          </button>
        )}
        {cameraOn && !recording && (
          <button className="btn btn-success" onClick={startRecording}>
            Start Recording
          </button>
        )}
        {recording && (
          <button className="btn btn-danger" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      <div className="text-center mt-3 fw-bold">Timer: {time}s</div>

      {videoURL && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Next → Review Page
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoRecord;
