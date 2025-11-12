
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function CandidateForm() {
  const navigate = useNavigate();
 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeFile({
          name: file.name,
          data: reader.result, 
        });
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = (data) => {
  const file = data.resume[0]; 
  if (!file) {
    alert("Please upload your resume before proceeding!");
    return;
  }

   if (file.size > 5 * 1024 * 1024) {
    alert(" Resume file too large! Maximum allowed size is 5 MB.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const fileData = reader.result;

    const candidateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      positionApplied: data.positionApplied,
      currentPosition: data.currentPosition,
      experience: data.experience,
      resumeName: file.name,
      resumeData: fileData, // base64
    };

    localStorage.setItem("candidateData", JSON.stringify(candidateData));
    navigate("/video-upload");

  };

  reader.readAsDataURL(file);
};



  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Candidate Information Form</h2>

      
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="mb-3">
          <label>First Name</label>
          <input
            className="form-control"
            {...register("firstName", { required: "First Name is required" })}
          />
          {errors.firstName && (
            <small className="text-danger">{errors.firstName.message}</small>
          )}
        </div>

        
        <div className="mb-3">
          <label>Last Name</label>
          <input
            className="form-control"
            {...register("lastName", { required: "Last Name is required" })}
          />
          {errors.lastName && (
            <small className="text-danger">{errors.lastName.message}</small>
          )}
        </div>

        
        <div className="mb-3">
          <label>Position Applied For</label>
          <select
            className="form-select"
            {...register("positionApplied", {
              required: "Position Applied is required",
            })}
          >
            <option value="">-- Select Position --</option>
            <option value="Frontend Developer">QA</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
          {errors.positionApplied && (
            <small className="text-danger">{errors.positionApplied.message}</small>
          )}
        </div>

        
        <div className="mb-3">
          <label>Current Position</label>
          <select
            className="form-select"
            {...register("currentPosition", {
              required: "Please select your current position",
            })}
          >
            <option value="">-- Select Current Position --</option>
            <option value="Freshr">Fresher</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Senior Developer">Senior Developer</option>
            
          </select>

          {errors.currentPosition && (
            <small className="text-danger">{errors.currentPosition.message}</small>
          )}
        </div>

        
        <div className="mb-3">
          <label>Experience (in Years)</label>
          <input
            type="number"
            className="form-control"
            {...register("experience", {
              required: "Experience is required",
              min: { value: 0, message: "Experience can't be negative" },
            })}
          />
          {errors.experience && (
            <small className="text-danger">{errors.experience.message}</small>
          )}
        </div>

        
        <div className="mb-3">
          <label>Upload Resume (PDF ≤ 5 MB)</label>
          <input
            type="file"
            accept=".pdf"
            className="form-control"
            onChange={handleFileChange}
            {...register("resume", { required: "Resume file is required" })}
          />
          {errors.resume && (
            <small className="text-danger">{errors.resume.message}</small>
          )}
        </div>

       
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting} 
        >
          {isSubmitting ? "Submitting..." : "Next"} 
        </button>
      </form>
    </div>
  );
}

export default CandidateForm;
