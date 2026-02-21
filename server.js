import express from "express"
import adminRoute from "./routes/admin-route.js"
import cors from "cors"
import env from "dotenv"
import authroute from "./routes/auth-route.js";
import { connectDb,disconnectDb } from "./config/db.js";

const app = express()
env.config()

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://pf-iota-one.vercel.app'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 
// app.use(helmet());
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200
// }));
connectDb()
app.use("/api/admin", adminRoute) 
app.use("/api/auth", authroute) 
app.get("/", (req, res) => {

  return res.status(200).json({ 
    success: true, 
    message: "successfully" 
  }); 
})
app.listen(5001, () => console.log("server is running")) 

// disconnectDb()