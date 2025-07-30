import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

import { Send } from "lucide-react";
import {
  Container,
  ChatArea,
  PdfArea,
  SubChatArea,
  InputButtonArea,
  StyledTextarea,
  SendButton,
  NotificationBox,
  CloseButton,
} from "../Style/PdfViewer.styled";

const PdfViewer = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  const file = location.state?.file;
  const handleSend = () => {
    setOutput(input);
    setInput("");
  };
  return (
    <Container>
      <ChatArea>
        <SubChatArea>
          {showNotification && (
            <NotificationBox>
              <strong>Your document is ready!</strong>
              <CloseButton onClick={() => setShowNotification(false)}>
                ×
              </CloseButton>
              <p style={{ marginTop: 10 }}>
                You can now ask questions about your document. For example:
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>“What is the main topic of this document?”</li>
                  <li>“Can you summarize the key points?”</li>
                  <li>“What are the conclusions or recommendations?”</li>
                </ul>
              </p>
            </NotificationBox>
          )}

          {output && (
            <div style={{ marginTop: 20 }}>
              <strong>You asked:</strong>
              <p>{output}</p>
            </div>
          )}
        </SubChatArea>

        <InputButtonArea>
          <StyledTextarea
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <SendButton onClick={handleSend}>
            <Send />
          </SendButton>
        </InputButtonArea>
      </ChatArea>

      <PdfArea>
        <p>No PDF uploaded.</p>
      </PdfArea>
    </Container>
  );
};

export default PdfViewer;
