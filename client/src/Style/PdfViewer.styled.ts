import styled from "styled-components";

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
  padding: 20px;
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
