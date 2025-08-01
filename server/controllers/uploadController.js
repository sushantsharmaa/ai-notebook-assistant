exports.handleUpload = (req, res) => {
  const filePath = `/pdfs/${req.file?.filename}`;
  res.json({ filePath });
};
