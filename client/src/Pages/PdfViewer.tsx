import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";

import {
  Container,
  ChatArea,
  PdfArea,
  PageTag,
  SubChatArea,
  InputButtonArea,
  StyledTextarea,
  SendButton,
  NotificationBox,
  CloseButton,
  PdfContainer,
  PdfEmbed,
  ErrorMessage,
  ErrorButton,
  LoadingSpinner,
  TypingIndicatorContainer,
  TypingDots,
} from "../Style/PdfViewer.styled";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ApiResponse {
  question: string;
  response: string;
  citations?: Array<{
    page: number;
    text: string;
  }>;
}

const PdfViewer = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showNotification, setShowNotification] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [citationPage, setCitationPage] = useState<number | undefined>(
    undefined
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const file = location.state?.file;
  const fileApi = `http://localhost:5000${file.filePath}`;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (fileApi) {
      setPdfLoading(true);

      fetch(fileApi, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            setPdfUrl(fileApi);
            setPdfError(false);
          } else {
            setPdfError(true);
          }
        })
        .catch(() => {
          setPdfError(true);
        })
        .finally(() => {
          setPdfLoading(false);
        });
    } else {
      setPdfLoading(false);
    }
  }, [fileApi]);

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const callChatApi = async (
    question: string,
    filename: string
  ): Promise<ApiResponse> => {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: filename,
        question: question,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setApiError(null);

    setIsTyping(true);

    try {
      const filename = file?.name || file?.filename || "document.pdf";

      const apiResponse = await callChatApi(currentInput, filename);

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        type: "assistant",
        content: apiResponse.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
      setShowNotification(false);
      setCitationPage(apiResponse.citations && apiResponse.citations[0].page);

      if (apiResponse.citations && apiResponse.citations.length > 0) {
        const firstCitation = apiResponse.citations[0];
        if (firstCitation.page) {
          setCurrentPage(firstCitation.page);
        }
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const getPdfEmbedUrl = () => {
    if (!pdfUrl) return "";

    const separator = pdfUrl.includes("?") ? "&" : "?";
    return `${pdfUrl}${separator}page=${currentPage}#zoom=${zoom}&view=FitH`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const TypingIndicator = () => (
    <TypingIndicatorContainer>
      <TypingDots>
        <div />
        <div />
        <div />
        <span>Thinking...</span>
      </TypingDots>
    </TypingIndicatorContainer>
  );

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
                  <li>"What is the main topic of this document?"</li>
                  <li>"Can you summarize the key points?"</li>
                  <li>"What are the conclusions or recommendations?"</li>
                </ul>
              </p>
            </NotificationBox>
          )}
          {!showNotification && chatMessages.length > 0 && (
            <h2
              style={{
                margin: "16px 0",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              ChatAI
            </h2>
          )}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent:
                    message.type === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    backgroundColor:
                      message.type === "user" ? "#007bff" : "#f8f9fa",
                    color: message.type === "user" ? "white" : "#333",
                    border:
                      message.type === "assistant"
                        ? "1px solid #e9ecef"
                        : "none",
                    position: "relative",
                  }}
                >
                  <div style={{ marginBottom: "4px" }}>
                    {message.content}
                    {message.type === "assistant" ? (
                      <PageTag>
                        <span>Page {citationPage}</span>
                      </PageTag>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      textAlign: "right",
                      marginTop: "4px",
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            {apiError && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f8d7da",
                  border: "1px solid #f5c6cb",
                  color: "#721c24",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              >
                <strong>Error:</strong> {apiError}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </SubChatArea>

        <InputButtonArea>
          <StyledTextarea
            placeholder="Ask something about your PDF..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <SendButton
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              opacity: !input.trim() || isTyping ? 0.5 : 1,
              cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
            }}
          >
            <Send />
          </SendButton>
        </InputButtonArea>
      </ChatArea>

      <PdfArea>
        {pdfLoading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading PDF...</p>
          </LoadingSpinner>
        ) : fileApi && pdfUrl && !pdfError ? (
          <PdfContainer>
            <PdfEmbed
              src={getPdfEmbedUrl()}
              type="application/pdf"
              title="PDF Document"
            />
          </PdfContainer>
        ) : pdfError ? (
          <ErrorMessage>
            <div>
              <h3 style={{ color: "#e74c3c", marginBottom: "10px" }}>
                PDF Loading Error
              </h3>
              <p>Unable to display the PDF file.</p>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  color: "#7f8c8d",
                }}
              >
                This might be due to browser restrictions or file format issues.
              </p>
              {fileApi && (
                <ErrorButton onClick={openInNewTab}>
                  Open PDF in New Tab
                </ErrorButton>
              )}
            </div>
          </ErrorMessage>
        ) : (
          <ErrorMessage>
            <div>
              <h3 style={{ color: "#95a5a6", marginBottom: "10px" }}>
                No PDF Selected
              </h3>
              <p>Please upload a PDF file to view it here.</p>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  color: "#7f8c8d",
                }}
              >
                Go back to the upload page to select a document.
              </p>
            </div>
          </ErrorMessage>
        )}
      </PdfArea>
    </Container>
  );
};

export default PdfViewer;
