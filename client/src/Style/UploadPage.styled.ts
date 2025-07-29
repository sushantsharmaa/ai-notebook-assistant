import styled, { keyframes } from "styled-components";
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f8fa;
`;

export const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
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

export const Icon = styled.div`
  font-size: 40px;
  color: #a855f7;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 8px;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const ProgressContainer = styled.div`
  width: 60%;
  text-align: left;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #e0d2ff;
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 8px;
`;

export const Text = styled.span`
  font-size: 14px;
  color: #9333ea;
`;

export const Percent = styled.span`
  float: right;
  font-size: 14px;
  font-weight: bold;
  color: #9333ea;
`;

export const ProgressBar = styled.div`
  background: #eee;
  height: 14px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 12px;
`;

export const Progress = styled.div<{ width: number }>`
  background: linear-gradient(to right, #a855f7, #9333ea);
  width: ${({ width }) => width}%;
  height: 100%;
  transition: width 0.2s ease;
`;
