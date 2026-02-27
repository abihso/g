import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import env from "dotenv"


env.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
/////////Cloudinary///////// 

 cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
 });
// console.log(process.env.CLOUD_NAME,process.env.API_KEY,process.env.API_SECRET)
 const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "files",
    allowed_formats: ["jpg", "png", "jpeg","pdf", "doc", "docx"],
  },
 });

export const upload = multer({ 
  storage
});
