import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UploadPage from "./Pages/UploadPage";
import PdfViewer from "./Pages/PdfViewer";
import ChatScreen from "./Pages/ChatScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/viewer" element={<PdfViewer />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
