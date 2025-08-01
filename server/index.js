require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/upload");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/pdfs", express.static(path.join(__dirname, "uploads")));

app.use("/upload", uploadRoutes);
app.use("/chat", chatRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
