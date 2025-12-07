import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Create images directory if it doesn't exist
const imagesDir = "./public/images";
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    // Get original filename without extension
    const originalName = path.parse(file.originalname).name;
    // Get file extension
    const extension = path.extname(file.originalname);
    // Create unique id
    const uniqueId = uuidv4();
    // Combine: originalfilename_uniqueid.extension
    const newFilename = `${originalName}_${uniqueId}${extension}`;
    cb(null, newFilename);
  },
});

export const upload = multer({ storage });
