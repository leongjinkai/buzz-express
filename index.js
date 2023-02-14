import express from "express";
// Parses incoming req bodies in a middleware before your handlers, available under the req.body property
import bodyParser from "body-parser";
// MongoDB object modelling tool designed to work in async env
import mongoose from "mongoose";
// Provide Connect/Express middleware that can be used to enable CORS for various options
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
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js"

// CONFIGURATION
// To get the file path
const __filename = fileURLToPath(import.meta.url);
// To get the directory path from file path
const __dirname = path.dirname(__filename)
// loads .env contents in process.env
dotenv.config();
// Creates an express app
const app = express();
// Returns middleware the only parses json
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"} ))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(cors());
// To serve static files
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// FILE STORAGE
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

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// ROUTES
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
// Let server connect to our mongo DB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)) 

    // ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`))

module.exports = app