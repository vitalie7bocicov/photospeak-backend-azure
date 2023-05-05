const express = require("express");
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const synthesize = require("./API/textToSpeechApi");
const app = express();
const cors = require("cors");
const multer = require("multer");
const populateDb = require("./API/populateDb");
const uploadPhoto = require("./API/uploadPhoto");
const upload = multer();
require("dotenv").config();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/what-is", upload.single("photo"), async (req, res) => {
  const language = req.body.language;
  const responseBody = await uploadPhoto(req);
  let photoUrl = responseBody.photoLink;
  if (!photoUrl)
    photoUrl =
      "https://www.rd.com/wp-content/uploads/2020/01/GettyImages-1131335393-e1650030686687.jpg";
  const labels = await getLabelsFromPhoto(photoUrl);
  for (let i = 0; i < labels.length; i++) {
    labels[i] = await translateText(labels[i], language);
  }
  populateDb(photoUrl, labels);
  res.send(labels);
});
app.get("/speech", async (req, res) => {
  const text = req.query.text;
  const audio = await synthesize(text);
  res.send(audio._readableState.buffer.head.data);
});
app.listen(80, () => {
  console.log("Server is listening on port 80");
});
