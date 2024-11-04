import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import users from "./routes/user.mjs"; // Your user routes
import requests from "./routes/request.mjs"; // Your requests routes
import cors from 'cors';  // Import CORS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware - Moved before routes
app.use(cors({
    origin: ['http://localhost:3001', 'https://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// User Routes
app.use("/user", users);

// Requests Routes
app.use("/requests", requests);

// Database connection
(async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
})();

// Read SSL certificate files
const options = {
    key: fs.readFileSync("keys/privatekey.pem"),
    cert: fs.readFileSync("keys/certificate.pem"),
};

// Create HTTPS server
const httpsServer = https.createServer(options, app);

// Start the HTTPS server
httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});
