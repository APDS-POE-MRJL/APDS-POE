import express from "express";
import { usersDb, requestsDb } from "../db/conn.mjs";
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
        // Ensure all fields are present
        if (!req.body.name || req.body.name.trim().split(/\s+/).length !== 2) {
            return res.status(400).json({ message: "Name must contain exactly two words" });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is invalid" });
        }
        if (!req.body.idNumber || req.body.idNumber.length !== 13) {
            return res.status(400).json({ message: "Id number is invalid" });
        }

        // Generate a unique account number
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Create a username based on the user's name
        const [firstName, lastName] = req.body.name.trim().split(/\s+/);
        const userName = `${firstName.slice(0, 4)}${lastName.slice(0, 3)}${accountNumber.slice(-4)}`;

        //  This document is shown to the user before hashing the password
        let successDocument = {
            userName: userName,
            accountNumber: accountNumber,
        };

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedId = await bcrypt.hash(req.body.idNumber, 10);
        const hashedAccountNumber = await bcrypt.hash(accountNumber, 10);
        
        //  This document is sent to MongoDB
        let newDocument = {
            name: req.body.name,
            userName: userName,
            idNumber: hashedId,
            accountNumber: hashedAccountNumber,
            password: hashedPassword,
            role: "user"
        };

        // Insert the new user into the "users" collection
        let collection = await usersDb.collection("users");
        let result = await collection.insertOne(newDocument);

        // Send a 201 response indicating successful user creation
        res.status(201).json(successDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
});

// Login route
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { userName, password, accountNumber } = req.body;
    try {
        const collection = await usersDb.collection("users");
        const user = await collection.findOne({ userName: userName });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed, no user found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        const accountMatch = await bcrypt.compare(accountNumber, user.accountNumber);

        if (passwordMatch && accountMatch) {
            // Successful login
            const token = jwt.sign({ accountNumber: accountNumber, role: user.role }, "secret_key", { expiresIn: "1h" });
            res.status(200).json({ message: "Authentication successful", token: token, accountNumber: accountNumber, role: user.role });
        } else {
            return res.status(401).json({ message: "Authentication failed with invalid details" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Authentication failed in general" });
    }
});

router.get("/locate", async (req, res) => {
    const { accountNumber } = req.query;

    if (!accountNumber) {
        return res.status(400).json({ message: "Account number is required" });
    }

    // Check for JWT token and role
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "secret_key");
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const role = decodedToken.role;
    if (role !== "admin") {
        return res.status(404).json({ message: "Not authorized" });
    }

    try {
        const requestsCollection = await requestsDb.collection("requests");
        const request = await requestsCollection.findOne({
            $or: [{ sender: accountNumber }, { recipiant: accountNumber }]
        });

        if (!request) {
            return res.status(404).json({ message: "No request found with the provided account number" });
        }

        const usersCollection = await usersDb.collection("users");
        const users = await usersCollection.find().toArray();

        let user = null;
        for (const u of users) {
            const accountMatch = await bcrypt.compare(accountNumber, u.accountNumber);
            if (accountMatch) {
                user = u;
                break;
            }
        }

        if (!user) {
            return res.status(404).json({ message: "No user found with the provided account number" });
        }

        // Decrypt user details (assuming bcrypt was used for hashing)
        const decryptedUser = {
            _id: user._id,
            name: user.name,
            userName: user.userName,
            idNumber: user.idNumber,
            accountNumber: user.accountNumber,
            password: user.password,
            role: user.role
        };

        res.status(200).json(decryptedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to locate user" });
    }
});

// Admin Sign up route
router.post("/adminsignup", async (req, res) => {
    try {
        // Ensure all fields are present
        if (!req.body.name || req.body.name.trim().split(/\s+/).length !== 2) {
            return res.status(400).json({ message: "Name must contain exactly two words" });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is invalid" });
        }
        if (!req.body.idNumber || req.body.idNumber.length !== 13) {
            return res.status(400).json({ message: "Id number is invalid" });
        }

        // Generate a unique account number
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Create a username based on the user's name
        const [firstName, lastName] = req.body.name.trim().split(/\s+/);
        const userName = `${firstName.slice(0, 4)}${lastName.slice(0, 3)}${accountNumber.slice(-4)}`;

        //  This document is shown to the user before hashing the password
        let successDocument = {
            userName: userName,
            accountNumber: accountNumber,
        };

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedId = await bcrypt.hash(req.body.idNumber, 10);
        const hashedAccountNumber = await bcrypt.hash(accountNumber, 10);
        
        //  This document is sent to MongoDB
        let newDocument = {
            name: req.body.name,
            userName: userName,
            idNumber: hashedId,
            accountNumber: hashedAccountNumber,
            password: hashedPassword,
            role: "admin"
        };

        // Insert the new user into the "users" collection
        let collection = await usersDb.collection("users");
        let result = await collection.insertOne(newDocument);

        // Send a 201 response indicating successful user creation
        res.status(201).json(successDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
});

export default router;
