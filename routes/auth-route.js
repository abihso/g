import { Router } from "express";
import bcrypt from "bcrypt"
import { getSingleMember, updatePassword } from "../services/prisma-functions.js";
import { hashPassword } from "../utils/password.js";
import { generateToken } from "../services/jsonwebtoken.js";
import verifyUser from "../middlewares/verify-user.js";

const authroute = Router()

authroute.post("/login", async (req, res) => {
  const data = req.body
  
  // Validate required fields
  if (!data.memberpin || !data.password || !data.role) {
    return res.status(400).json({ 
      success: false, 
      message: "Member PIN, password and role are required" 
    });
  }
  
  if(data.role !== "Administrator" && data.role !== "Member") {
    return res.status(400).json({ 
      success: false, 
      message: "Please select a valid role (Administrator or Member)" 
    });
  }
  
  try {
    const user = await getSingleMember(data.memberpin)
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid member PIN or password" 
      });
    }
    
    const isPasswordValid = bcrypt.compareSync(data.password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid member PIN or password" 
      });
    }
    
    // Remove password from user object
    user.password = undefined
    user.role = data.role
    
    const token = generateToken(
      { id: user.memberpin, role: data.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    )
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        fname: user.fname,
        lname: user.lname,
        memberpin: user.memberpin,
        email: user.email,
        role: data.role,
        status: user.status
      }
    })
    
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ 
      success: false, 
      message: "An error occurred during login. Please try again.",
      error: error.message
    })
  }
})

authroute.post("/logout", (req, res) => {
  // Since JWT is stateless, logout is handled client-side
  // But we can still return a success response
  return res.status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
})

authroute.patch("/update-password", async (req, res) => {
  const data = req.body
  // Validate required fields
  if (!data.pin || !data.oldPassword || !data.newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: "Member PIN, old password and new password are required" 
    });
  }
  
  // Validate password length
  if (data.newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "New password must be at least 6 characters long" 
    });
  }
  
  try {
    const user = await getSingleMember(data.pin)
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    const isOldPasswordValid = bcrypt.compareSync(data.oldPassword, user.password)
    
    if (!isOldPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }
    
    // Check if new password is same as old
    if (bcrypt.compareSync(data.newPassword, user.password)) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be different from current password" 
      });
    }
    
    const hashNewPassword = hashPassword(data.newPassword)
    await updatePassword(hashNewPassword, data.pin)
    
    return res.status(200).json({ 
      success: true, 
      message: "Password updated successfully" 
    })
    
  } catch (error) {
    console.error("Password update error:", error)
    return res.status(500).json({ 
      success: false, 
      message: "An error occurred while updating password. Please try again." 
    })
  }
})

authroute.post("/verify", verifyUser, (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user
  })
})

export default authroute