import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Sign up route
router.post("/signup", async (req, res) => {
    try {
        // Ensure password is present in the request body
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create a new user document
        let newDocument = {
            name: req.body.name,
            password: hashedPassword
        };
        
        // Insert the new user into the "users" collection
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        
        // Send a 201 response indicating successful user creation
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
});


// Login route
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name: name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Successful login
            const token = jwt.sign({ username: name }, "secret_key", { expiresIn: "1h" });
            res.status(200).json({ message: "Authentication successful", token: token, name: name });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Authentication failed" });
    }
});

export default router;
