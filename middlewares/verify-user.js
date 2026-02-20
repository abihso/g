import {prisma} from "../config/db.js"
import { verify } from "../services/jsonwebtoken.js"

const verifyUser = async (req, res, next) => {
  try {
    const decoded = verify(req.body.token, process.env.JWT_SECRET)

    const user = await prisma.user.findFirst({
      where: { memberpin: decoded.id },
      omit: { password: true }  
    })

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    req.user = user
    return next() // ✅ stop here

  } catch (error) {
    return res.status(401).json({ success: false, message: "Verification failed" })
  }
}


export default verifyUser