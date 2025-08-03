import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Send } from "lucide-react";
import { useParams } from "react-router-dom";

import {
  Container,
  ChatArea,
  PdfArea,
  SubChatArea,
  InputButtonArea,
  HeaderContainer,
  BackButton,
  HeaderTitle,
  NotificationBox,
  CloseButton,
  ChatHistoryContainer,
  ChatMessageContainer,
  UserMessageBubble,
  AIMessageBubble,
  ResponseContainer,
  CitationsButtonContainer,
  CitationButton,
  LoadingMessageContainer,
  LoadingSpinner,
  LoadingText,
  PDFLoadingContainer,
  PDFErrorContainer,
  NoPDFContainer,
  PDFContainer,
  PDFViewerContainer,
  PDFIframe,
  EnhancedSendButton,
  EnhancedTextarea,
} from "../Style/PdfViewer.styled";
interface Citation {
  page: number;
  text: string;
}

interface ChatMessage {
  type: "user" | "ai";
  question?: string;
  response?: string;
  citations?: Citation[];
  timestamp: number;
}

const PdfViewer: React.FC = () => {
  const { id: pdfId } = useParams<{ id: string }>();
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pdfId && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchPdf(pdfId);
    }
  });

  const fetchPdf = async (id: string) => {
    if (loading || pdfUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://ai-notebook-assistant-one.onrender.com/upload/pdf/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!input.trim() || !pdfId || chatLoading) return;

    const userMessage: ChatMessage = {
      type: "user",
      question: input,
      timestamp: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const response = await fetch(
        "https://ai-notebook-assistant-one.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            fileId: pdfId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        type: "ai",
        question: data.question,
        response: data.response,
        citations: data.citations || [],
        timestamp: Date.now(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        type: "ai",
        response: `Sorry, I encountered an error: ${err.message}`,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
      setInput("");
    }
  };

  const handleSend = () => {
    sendChatMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleCitationClick = (pageNumber: number) => {
    if (pdfUrl) {
      const iframe = document.querySelector(
        'iframe[title="PDF Viewer"]'
      ) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = `${pdfUrl}#page=${pageNumber}`;
      }
    }
  };

  const formatResponse = (text: string) => {
    return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <Container>
      <ChatArea>
        <HeaderContainer>
          <BackButton>
            <ArrowLeft onClick={() => navigate("/")} />
          </BackButton>
          <HeaderTitle>Document Chat AI</HeaderTitle>
        </HeaderContainer>
        <SubChatArea>
          {showNotification && chatHistory.length === 0 ? (
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
          ) : null}

          <ChatHistoryContainer>
            {chatHistory.map((message, index) => (
              <ChatMessageContainer key={index}>
                {message.type === "user" ? (
                  <UserMessageBubble>
                    <strong>You:</strong>
                    <p>{message.question}</p>
                  </UserMessageBubble>
                ) : (
                  <AIMessageBubble>
                    <strong>AI Assistant:</strong>
                    <ResponseContainer>
                      {message.response && formatResponse(message.response)}
                    </ResponseContainer>

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                      <CitationsButtonContainer>
                        {message.citations.map((citation, citIndex) => (
                          <CitationButton
                            key={citIndex}
                            onClick={() => handleCitationClick(citation.page)}
                            title={citation.text}
                          >
                            Page {citation.page}
                          </CitationButton>
                        ))}
                      </CitationsButtonContainer>
                    )}
                  </AIMessageBubble>
                )}
              </ChatMessageContainer>
            ))}

            {chatLoading && (
              <LoadingMessageContainer>
                <LoadingSpinner />
                <LoadingText>AI is thinking...</LoadingText>
              </LoadingMessageContainer>
            )}
          </ChatHistoryContainer>
        </SubChatArea>

        <InputButtonArea>
          <EnhancedTextarea
            placeholder="Ask something about your document..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={chatLoading}
          />
          <EnhancedSendButton
            onClick={handleSend}
            disabled={chatLoading || !input.trim()}
          >
            <Send />
          </EnhancedSendButton>
        </InputButtonArea>
      </ChatArea>

      <PdfArea>
        {loading && (
          <PDFLoadingContainer>
            <p>Loading PDF...</p>
          </PDFLoadingContainer>
        )}

        {error && (
          <PDFErrorContainer>
            <p>Error: {error}</p>
            {pdfId && <p>PDF ID: {pdfId}</p>}
          </PDFErrorContainer>
        )}

        {!pdfId && !loading && (
          <NoPDFContainer>
            <p>No PDF ID provided.</p>
          </NoPDFContainer>
        )}

        {pdfUrl && !loading && !error && (
          <PDFContainer>
            <PDFViewerContainer>
              <PDFIframe
                src={pdfUrl}
                title="PDF Viewer"
                onError={() => {
                  console.log("Iframe failed, trying object element");
                }}
              />
            </PDFViewerContainer>
          </PDFContainer>
        )}
      </PdfArea>
    </Container>
  );
};

export default PdfViewer;
