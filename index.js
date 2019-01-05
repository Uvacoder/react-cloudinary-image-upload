const express = require("express");
const cloudinary = require("cloudinary");
const cors = require("cors");
const formData = require("express-form-data");
require("dotenv").config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(formData.parse());
app.use(cors({ origin: 3000 }));

app.get("/images", async (req, res) => {
  cloudinary.v2.api.resources({ type: "upload" }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/upload", async (req, res) => {
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));
  const result = await Promise.all(promises);
  console.log(result);
  res.json(result);
});

const server = app.listen(4000, () => {
  console.log(`Listening on ${server.address().port}`);
});
