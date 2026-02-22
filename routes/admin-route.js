import { Router } from "express";
import { upload } from "../utils/multer.js";
import path from "path"
import fs from "fs";
import { fileURLToPath } from "url";
import { createNewMember,createMessage,getMessages,removeMessage,createNewAdmin,getMembers,getSingleMember,updateMember,removeMember,verifyClaim,registerBenefit,adminRegisterBenefit,getAllSpecificApplications,getAllApplications,getSingleApplication,searchMember,searchBenefit,updateRecord,pay, getAllSpecificApplicationsByUser, getAllApplicationsByMember, getMessage } from "../services/prisma-functions.js";
import { hashPassword } from "../utils/password.js";
const adminRoute = Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

adminRoute.post("/send-message", upload.any(), async (req, res) => {
try {
  const infor = req.body
    await createMessage(infor)
    return res.status(201).json({success : true,message:"message sent"})
} catch (error) {
    return res.status(400).json({success:false,message:"problem sending message",...error})
  }
})
adminRoute.get("/get-all-message", async (req, res) => {
  const messages = await getMessages()
  return res.status(200).json({success:true,data:messages})
})
adminRoute.get("/get-single-message/:id", async (req, res) => {
  const message = await getMessage(Number(req.params.id))
  return res.status(200).json({success:true,data:message})
})
adminRoute.delete("/delete-message/:id", (req, res) => {
  try {
    removeMessage(req.params.id)
    return res.status(200).json({ success: true, message: "message deleted" })
  } catch (error) {
    return res.status(400).json({success : false,message:"problem deleting message",error :error.message})
  }
})
adminRoute.post("/register-member", upload.any(), async (req, res) => {
  try {
      const infor = req.body
      infor.img = req.files[0].filename
      infor.password = hashPassword(infor.fname)
      await createNewMember(infor)
      return res.status(201).json({success : true,message:"user created"})
    } catch (error) {
      return res.status(400).json({success:false,message:"problem saving user",...error})
    }
})
adminRoute.post("/register-admin", upload.any(), async (req, res) => {
  try {
      const infor = req.body
    // infor.img = req.files[0].filename || ""
      infor.img = ""
      infor.password = hashPassword(infor.fname)
      // infor.status = "admin"
      const results = await createNewAdmin(infor)
      return res.status(201).json({success : true,message:"user created"})
  } catch (error) {
        return res.status(400).json({success:false,message:"problem saving user",...error})
    }
})
adminRoute.get("/get-all-members", async (req, res) => {
  const members = await getMembers() 
  return res.status(200).json({success:true,data:members})
})
adminRoute.get("/get-single-member/:id", async (req, res) => {
  try {
    const member =  await getSingleMember(req.params.id)
    // console.log(member)
    return res.status(200).json({success:true,data:member})
  } catch (error) {
    return res.status(400).json({success:false,message:"problem fetching member",error : error.message})
  } 
})
adminRoute.patch("/update-member/:id", async (req, res) => {
  const data = req.body
  const {id} = req.params 
  try {
    await updateMember(id,data)
    return res.status(200).json({ success: true, message: "record updated" })
  } catch (error) {
    return res.status(400).json({success:false,message:"failed updating the record"})
  }
})
adminRoute.delete("/delete-member/:id", async (req, res) => {
  try {
    await removeMember(req.params.id)
    return res.status(200).json({success : true,message:"user removed"})
  } catch (error) {
    return res.status(400).json({success : false,message:"problem removing user",error :error.message})
  }
})
adminRoute.get("/get-all-applications/:status/:memberpin/:user", async (req, res) => {
  try {
    const data = await getAllSpecificApplicationsByUser(req.params.status, req.params.memberpin)
    return res.status(200).json({ success : true,data})
  } catch (error) {
    return res.status(400).json({ success : false,message : error.message})
  }
})
adminRoute.get("/get-all-applications/:column/:value", async (req, res) => {
  try {
    const data = await getAllSpecificApplications(req.params.column, req.params.value)
    return res.status(200).json({ success : true,data})
  } catch (error) {
    return res.status(400).json({ success : false,message : error.message})
  }
})
adminRoute.get("/get-all-applications", async (req, res) => {
  try {
    const data = await getAllApplications()
    return res.status(200).json({ success : true,data})
  } catch (error) {
    return res.status(400).json({ success : false,message : error.message})
  }
})
adminRoute.get("/get-all-applications-by-member/:memberpin", async (req, res) => {
  console.log(req.params.memberpin)
  try {
    const data = await getAllApplicationsByMember(req.params.memberpin)
    return res.status(200).json({ success : true,data})
  } catch (error) {
    return res.status(400).json({ success : false,message : error.message})
  }
})
adminRoute.post("/process-member-application",upload.any(),async (req, res) => {
  const data = req.body
  data.oldpayslip = req.files[0].filename
  data.currentpayslip = req.files[1].filename
  data.supportdocuments = req.files[2].filename
  data.supportdocument = req.files[3].filename
  try {
    ////////////////////////  
    if (data.benefit == "death of parent" || data.benefit == "death of spouse" || data.benefit == "death of member" || data.benefit == "marriage"|| data.benefit == "retirement" || data.benefit == "release"|| data.benefit == "death of child" || data.benefit == "wrongful deduction" || data.benefit == "disaster" || data.benefit == "hospitalization") {
      const v = await verifyClaim(data.benefit, data.memberpin) 
      if (v.length >= 1)
      {
        throw new Error(`you have already applied for ${data.benefit} benefit visit the office for any assistance`) 
      } else {
        await registerBenefit(data) 
      
      }
    }else{
      return res.status(400).json({success : false,message:"Failed to process application"})
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({success : false,message:error.message})
  }
  return res.status(200).json({ success : true,message:"Benefit has been submitted"})
})
adminRoute.post("/admin-process-member-application",upload.any(),async(req, res) => {
  const data = req.body
  data.oldpayslip = "req.files[0].filename"
  data.currentpayslip = "req.files[1].filename"
  data.supportdocuments = "req.files[2].filename"
  try {
    const results = adminRegisterBenefit(data)
  } catch (error) {
    return res.status(400).json({success : false,message:error.message})
  }
  return res.status(200).json({ success : true,message:"Benefit has been submitted"})
})
adminRoute.get("/get-single-application/:id",async (req, res) => {
  try {
    const data = await getSingleApplication(Number(req.params.id))
    return res.status(200).json({success : true,data})
  } catch (error) {
     return res.status(400).json({success : false,message : error.message})
  }
})
adminRoute.get("/get-file/:name/:type", async (req, res) => {
  try {
    const { name, type } = req.params;
    
    // Security: Prevent directory traversal attacks
    const safeName = path.basename(name); // Removes any path components
    
    // Determine if running on Vercel
    const isVercel = process.env.VERCEL === '1';
    
    // Build the correct path based on environment
    let basePath;
    if (isVercel) {
      basePath = '/tmp/uploads';
    } else {
      // Local development path - adjust based on your project structure
      basePath = path.join(__dirname, '..', 'uploads'); // Go up one level from routes
    }
    
    // Construct full file path based on type
    let filePath;
    if (type === "image") {
      filePath = path.join(basePath, "members", "images", safeName);
    } else if (type === "document") {
      filePath = path.join(basePath, "applications", "documents", safeName);
    } else {
      return res.status(400).json({ 
        message: "Invalid file type. Use 'image' or 'document'" 
      });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ 
        message: "File not found",
        path: isVercel ? 'temp' : filePath // Don't expose full path in production
      });
    }

    // Get file stats for additional info
    const stat = fs.statSync(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // For images: display in browser
    if (type === "image") {
      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf'
      };
      
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      
      // Send file for display
      return res.status(200).sendFile(filePath);
    } 
    // For documents: force download
    else {
      // Set filename for download
      const fileName = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      // Download the file
      return res.status(200).download(filePath, fileName, (err) => {
        if (err) {
          console.error("Download error:", err);
          // Can't send response here as headers might already be sent
        }
      });
    }
    
  } catch (error) {
    console.error("File retrieval error:", error);
    return res.status(500).json({ 
      message: "Error retrieving file",
      error: error.message 
    });
  }
});
adminRoute.patch("/update-record/:id/:status/:verified_by",async (req, res) => {
  const { id, status,verified_by } = req.params
  try {
    await updateRecord(Number(id), status, verified_by)
    return res.status(200).json({success : true,message:`benefit ${status}`})
  } catch (error) {
     return res.status(400).json({success : false,message:error.message})
  }
})
adminRoute.patch("/pay-benefit", async(req, res) => {
  const { pin,benefit,approved_by } = req.body
  try {
    const verify = await verifyClaim(benefit, pin)
    if(typeof verify[0] === "undefined") throw new Error(`${benefit} benefit has not been applied for yet`)   
    if (verify && verify[0].status === "Approved") {
      pay(pin, approved_by,benefit)
      return res.status(200).json({success : true,message:`benefit paid`})
    }
    throw new Error(`${benefit} benefit has not been approved or has already been paid for`)
  } catch (error) {
     return res.status(400).json({success : false,message:error.message})
  }
})
adminRoute.get("/verify-user-claim/:id/:benefit", async (req, res) => {
  try {
    const data = await verifyClaim(req.params.benefit, req.params.id)
    return res.status(200).json({success : true,data})
  } catch (error) {
    return res.status(400).json({success : false,message : error.message})
  }
})
adminRoute.get("/get-member/:value", async (req, res) => {
    const data = await searchMember(req.params.value) 
  return res.status(200).json({success : true,data })
})
adminRoute.get("/get-specific-application-by-members/:value", async (req, res) => {
  const data = await searchBenefit(req.params.value)
  return res.status(200).json({ success: true, data })
})


export default adminRoute      