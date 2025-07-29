import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PdfViewer from "./Pages/PDFViewer";
import UploadPage from "./Pages/UploadPage";
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
