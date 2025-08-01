import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const ChatArea = styled.div`
  width: 50%;
  padding: 20px;
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
`;

export const PdfArea = styled.div`
  width: 50%;

  overflow-y: auto;
`;

export const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background-color: #f3e8ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NotificationBox = styled.div`
  background-color: #f3e8ff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  color: #6b21a8;
  font-size: 14px;
  position: relative;
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
  background-color: #a855f7;
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
export const PdfContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
`;

export const PdfToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #2c3e50;
  color: white;
  gap: 15px;
  font-size: 14px;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background: #34495e;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  gap: 5px;
  transition: background 0.2s;

  &:hover {
    background: #4a6741;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #2c3e50;
  }
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: #ecf0f1;
  min-width: 120px;
  text-align: center;
  font-weight: 500;
`;

export const ZoomInfo = styled.span`
  font-size: 14px;
  color: #ecf0f1;
  min-width: 60px;
  text-align: center;
  font-weight: 500;
`;

export const PdfViewerContainer = styled.div``;

export const PdfEmbed = styled.embed`
  width: 100%;
  height: 800px;
  max-width: 900px;

  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  font-size: 16px;
  text-align: center;
  background: #ecf0f1;
  padding: 40px;
`;

export const ErrorButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  background: #ecf0f1;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #bdc3c7;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

export const TypingIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e9ecef;
  max-width: 200px;
`;

export const PageTag = styled.span`
  background-color: #f3e8ff;
  width: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9333ea;
  padding: 4px 10px;
  margin-top: 10px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: block;
`;

export const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  div {
    width: 8px;
    height: 8px;
    background-color: #6c757d;
    border-radius: 50%;
    animation: ${typingAnimation} 1.4s ease-in-out infinite both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  span {
    margin-left: 8px;
    color: #6c757d;
    font-size: 14px;
  }
`;
