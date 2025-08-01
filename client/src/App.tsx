import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UploadPage from "./Pages/UploadPage";
import PdfViewer from "./Pages/PdfViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/viewer" element={<PdfViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
