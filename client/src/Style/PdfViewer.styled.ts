import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const ChatArea = styled.div`
  width: 50%;
  padding: 20px;
  padding-top: 0px;
  border-right: 1px solid #e2e8f0;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
`;

export const InputButtonArea = styled.div`
  display: flex;
`;

export const SubChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  -ms-overflow-style: none;
`;

export const ChatMessageContainer = styled.div`
  margin-bottom: 20px;
`;

export const PdfArea = styled.div`
  width: 50%;
  overflow-y: auto;
`;

export const NotificationBox = styled.div`
  background-color: #ebd6fb;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  color: #6b21a8;
  font-size: 14px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b21a8;
`;

export const StyledTextarea = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  resize: none;
  font-size: 14px;
  outline: none;
`;

export const SendButton = styled.button`
  background-color: #667eea;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 10px 16px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const ChatHistoryContainer = styled.div`
  flex: 1;
  padding: 10px 0;
`;

export const UserMessageBubble = styled.div`
  background-color: #a4cdeaff;
  padding: 12px 16px;
  border-radius: 12px;
  margin-right: 10px;
  margin-left: 20%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  strong {
    color: #333;
  }

  p {
    margin: 8px 0 0 0;
    line-height: 1.5;
  }
`;

export const AIMessageBubble = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  margin-left: 10px;
  margin-right: 10%;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  strong {
    color: #1976d2;
  }
`;

export const ResponseContainer = styled.div`
  margin-top: 8px;

  p {
    margin: 8px 0;
    line-height: 1.5;
  }
`;

export const CitationsContainer = styled.div`
  margin-top: 16px;

  strong {
    font-size: 14px;
    color: #666;
  }
`;

export const CitationsButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const CitationButton = styled.button`
  padding: 6px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }

  &:active {
    background-color: #0d47a1;
  }
`;

export const LoadingMessageContainer = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  margin-right: 10%;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1976d2;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.span`
  color: #666;
`;

export const PDFLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  p {
    font-size: 16px;
    color: #666;
  }
`;

export const PDFErrorContainer = styled.div`
  color: red;
  padding: 20px;
  text-align: center;

  p {
    margin: 8px 0;
  }
`;

export const NoPDFContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  p {
    font-size: 16px;
    color: #666;
  }
`;

export const PDFContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PDFPageIndicator = styled.div`
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
  font-size: 14px;
  color: #6c757d;
`;

export const PDFViewerContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const PDFIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const EnhancedInputButtonArea = styled(InputButtonArea)`
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading {
    opacity: 0.7;
  }
`;

export const EnhancedSendButton = styled(SendButton)<{ disabled?: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EnhancedTextarea = styled(StyledTextarea)<{ disabled?: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ConditionalNotificationBox = styled(NotificationBox)<{
  show: boolean;
}>`
  display: ${(props) => (props.show ? "block" : "none")};
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin: 10px 0px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: sticky;
  top: 0;
  color: white;
  z-index: 100;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`;

export const HeaderTitle = styled.h1`
  margin-left: 15px;
  font-size: 18px;
  padding: 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
