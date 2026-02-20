import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  };
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folder;
      if (req.path.includes("/process-member-application") || req.path.includes("/admin-process-member-application")) {
        folder = path.join(__dirname, "../uploads/applications/documents");
      } 
      if (req.path.includes("/register-member") || req.path.includes("/register-admin")) {
        
        folder = path.join(__dirname, "../uploads/members/images");
      } 

      ensureDirExists(folder);
      cb(null, folder);
      
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = {
      documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      images: ["image/jpeg", "image/png", "image/gif"]
    };
  
    if (req.path.includes("/process-member-application") && !allowedFileTypes.documents.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false);
    }
    if (req.path.includes("/register-member") && !allowedFileTypes.images.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images (JPG, PNG, GIF) are allowed."), false);
    }
    cb(null, true); 
};
export const upload = multer({ storage, fileFilter });
