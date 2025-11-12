import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CandidateForm from './pages/CandidateForm'
import ReviewPage from "./pages/ReviewPage";
import VideoUpload from "./pages/VideoUpload.jsx";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateForm />} />
        <Route path="/video-upload" element={<VideoUpload />} />
        <Route path="/review" element={<ReviewPage />} />
        
      </Routes>
    </Router>
  )
}

export default App
