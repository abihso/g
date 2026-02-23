import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Use /tmp for Vercel, local uploads for development
const getUploadBasePath = () => {
  if (isVercel) {
    return '/tmp/uploads';
  }
  return path.join(__dirname, '../uploads');
};

const ensureDirExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// Create base upload directory
const baseUploadDir = getUploadBasePath();
ensureDirExists(baseUploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    const baseDir = getUploadBasePath();
    
    if (req.path.includes("/process-member-application") || req.path.includes("/admin-process-member-application")) {
      folder = path.join(baseDir, "applications/documents");
    } 
    else if (req.path.includes("/register-member") || req.path.includes("/register-admin")) {
      folder = path.join(baseDir, "members/images");
    } else {
      // Default folder if no match
      folder = path.join(baseDir, "misc");
    }

    // Ensure the directory exists
    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const sanitizedName = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, sanitizedName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = {
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    images: ["image/jpeg", "image/png", "image/gif", "image/webp"]
  };

  if (req.path.includes("/process-member-application") || req.path.includes("/admin-process-member-application")) {
    if (!allowedFileTypes.documents.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false);
    }
  }
  else if (req.path.includes("/register-member") || req.path.includes("/register-admin")) {
    if (!allowedFileTypes.images.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images (JPG, PNG, GIF, WEBP) are allowed."), false);
    }
  }
  
  cb(null, true);
};

// Set file size limits (optional)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits 
});