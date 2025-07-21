import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import {
  DATABASE,
  MAX_JSON_SIZE,
  PORT,
  REQUEST_NUMBER,
  REQUEST_TIME,
  URL_ENCODE, 
  WEB_CACHE,
} from "./app/config/config.js";
import router from "./routes/api.js";

const app = express();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App use default middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODE }));
app.use(cookieParser());
app.use(helmet());

// App use limiter
const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER });
app.use(limiter);

// Cache
app.set("etg", WEB_CACHE);

// Database connection
const connection = async () => {
  try {
    await mongoose.connect(DATABASE, { autoIndex: true });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log("MongoDB disconnected!");
    console.log(err.toString());
  }
};

connection();

// Base url
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to the API! Use /api/v1 for endpoints.");
});

// Not Found
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found!" });
});
