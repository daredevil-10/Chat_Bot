import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response)=>{
    res.send("Hello World! This is a test response.");
});

app.listen(port, (): void =>{
    console.log(`Server is running on port http://localhost:${port}`);
});