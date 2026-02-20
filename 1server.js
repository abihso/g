import express from "express"
import env from "dotenv"
import { connectDb } from "./config/db.js"

const app = express()
env.config()

connectDb()
app.listen(5001, () => console.log("server is running"))

