import express from "express";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import serveIndex from "serve-index";
import { fileURLToPath } from "url";

import multer from "multer";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const cdnRoot = path.join(__dirname, "assets");

fs.mkdirSync(cdnRoot, { recursive: true });

// Enable gzip compression
app.use(compression());
// Logging
app.use(morgan("tiny"));
// Cache-Control headers for static files
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});


app.use(express.static(cdnRoot));

// Configure multer storage dynamically based on parameter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // default subdirectory if not provided
    const subDir = req.body.path || "files";

    // sanitize input (avoid ../../)
    const safeSubDir = subDir.replace(/(\.\.[/\\])/g, "");

    const uploadPath = path.join(cdnRoot, safeSubDir);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep original filename
  },
});

const upload = multer({ storage });


// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const subDir = req.body.path || "files";
  const fileUrl = `https://cdn.petterssonhome.se/assets/${subDir}/${req.file.filename}`;

  res.json({
    message: "File uploaded successfully!",
    url: fileUrl,
  });
});

// app.use("/cdn", express.static(path.join(__dirname, "assets")));

app.use("/", serveIndex(cdnRoot, { icons: true }));

const PORT = process.env.CDN_PORT || 9093;
app.listen(PORT, () => {
  console.log(`CDN Server running on http://localhost:${PORT}/cdn`);
});
