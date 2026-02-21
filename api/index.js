import express from "express";
import adminRoute from "../routes/admin-route.js";
import cors from "cors";
import env from "dotenv";
import authroute from "../api/routes/auth-route.js";
import { connectDb } from "../api/config/db.js";

env.config();
const app = express();

app.use(cors({
  origin: "https://pf-iota-one.vercel.app/", // put your real frontend URL here
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDb();

app.use("/admin", adminRoute);
app.use("/auth", authroute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Good"
  });
});

export default app;