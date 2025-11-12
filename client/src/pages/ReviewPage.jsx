import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReviewPage() {
  const [candidate, setCandidate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("candidateData");
    if (data) setCandidate(JSON.parse(data));
  }, []);

  const handleConfirm = async () => {
    if (!candidate) return;
    setSubmitting(true);

    try {
      // Base64 → Blob → File
      const blob = await fetch(candidate.resumeData).then((res) => res.blob());
      const file = new File([blob], candidate.resumeName, {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("firstName", candidate.firstName);
      formData.append("lastName", candidate.lastName);
      formData.append("positionApplied", candidate.positionApplied);
      formData.append("currentPosition", candidate.currentPosition);
      formData.append("experience", candidate.experience);
      formData.append("resume", file);

      
      if (candidate.videoData) {
        const blob = await fetch(candidate.videoData).then((res) => res.blob());
        const videoFile = new File([blob], candidate.videoName, {
          type: "video/mp4",
        });
        formData.append("video", videoFile);
      }

      
      await axios.post("/api/candidate/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Submitted successfully!");
      localStorage.removeItem("candidateData");
      navigate("/");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to submit form!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!candidate)
    return (
      <div className="container text-center mt-5">
        <h4>No candidate data found</h4>
      </div>
    );

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Review Your Application
      </h2>

      <div className="ml">
        <p>
          <b>First Name:</b> {candidate.firstName}
        </p>
        <p>
          <b>Last Name:</b> {candidate.lastName}
        </p>
        <p>
          <b>Position Applied:</b> {candidate.positionApplied}
        </p>
        <p>
          <b>Current Position:</b> {candidate.currentPosition}
        </p>
        <p>
          <b>Experience:</b> {candidate.experience} years
        </p>
        <p>
          <b>Resume:</b>{" "}
          {candidate.resumeData ? (
            <a
              href={URL.createObjectURL(
                new Blob(
                  [
                    Uint8Array.from(
                      atob(candidate.resumeData.split(",")[1]),
                      (c) => c.charCodeAt(0)
                    ),
                  ],
                  { type: "application/pdf" }
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary ms-2"
            >
              View Resume
            </a>
          ) : (
            <button className="btn btn-sm btn-outline-secondary ms-2" disabled>
              Loading Resume...
            </button>
          )}
        </p>
      </div>

      
      {candidate.videoData && (
        <div className="mt-4 text-center">
          <h5 className="text-primary fw-bold mb-3">Video Introduction Preview</h5>
          <div className="d-flex justify-content-center">
            <video
              src={candidate.videoData}
              controls
              width="400"
              style={{ borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
            />
          </div>
        </div>
      )}

      <div className="d-flex gap-4 mt-4 justify-content-center">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary px-4 py-2"
        >
          Edit
        </button>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="btn btn-primary px-4 py-2"
        >
          {submitting ? "Submitting..." : "Confirm & Submit"}
        </button>
      </div>
    </div>
  );
}

export default ReviewPage;
