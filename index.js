import express from "express";
// Parses incoming req bodies in a middleware before your handlers, available under the req.body property
import bodyParser from "body-parser";
// MongoDB object modelling tool designed to work in async env
import mongoose from "mongoose";
import cors from "cors";
// Loads environment variables from a .env file into process.env
import dotenv from "dotenv"
// Used to handle multipart/form-data, which is primarily used for uploading files
import multer from "multer";
// Helps secure Express Apps by setting various HTTP Headers
import helmet from "helmet";
// Used as a HTTP request logger middleware
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"} ))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// File Storage
const storage = multer.diskStorage({
    // Everytime someone uploads an image, it is saved in this public assets folder
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
// This variable is used whenever there needs to have an upload function
const upload = multer({ storage })

