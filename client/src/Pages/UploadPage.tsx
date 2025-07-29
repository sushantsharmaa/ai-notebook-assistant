import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import {
  Container,
  Card,
  Icon,
  IconWrapper,
  Title,
  Subtitle,
  HiddenInput,
  ProgressContainer,
  Spinner,
  Text,
  Percent,
  ProgressBar,
  Progress,
} from "../Style/UploadPage.styled";

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/viewer"); // 👈 Navigate after 100%
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <Container>
      {uploading ? (
        <ProgressContainer>
          <Spinner />
          <Text>Uploading PDF</Text>
          <Percent>{progress}%</Percent>
          <ProgressBar>
            <Progress width={progress} />
          </ProgressBar>
        </ProgressContainer>
      ) : (
        <Card onClick={() => document.getElementById("fileInput")?.click()}>
          <IconWrapper>
            <Upload size={30} color="#a855f7" />
          </IconWrapper>
          <Title>Upload PDF to start chatting</Title>
          <Subtitle>Click or drag and drop your file here</Subtitle>
          <HiddenInput
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileUpload}
          />
        </Card>
      )}
    </Container>
  );
};

export default UploadPage;
