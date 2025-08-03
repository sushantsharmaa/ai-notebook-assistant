import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import {
  Container,
  Card,
  IconWrapper,
  Title,
  InfoBox,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://ai-notebook-assistant-one.onrender.com/upload/pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("data", data);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate(`/viewer/${data?.file?.id}`);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
    }
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
          <InfoBox>
            <p>📄 Only PDF format is supported</p>
            <p>⚡ Instantly get AI-powered answers & summaries</p>
            <p>🎯 Ideal for research papers, study notes, manuals & more</p>
          </InfoBox>
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
