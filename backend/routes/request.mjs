import express from "express";
import  {usersDb, requestsDb} from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);


//This page will be for both admins and users, users can see their pending requests and admins can see all pending requests
router.get("/list", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const accountNumber = decodedToken.accountNumber;
        const role = decodedToken.role;

        let query = { status: "Pending" };
        if (role === "user") {
            query.sender = accountNumber;
        }

        let collection = await requestsDb.collection("requests");
        let results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request failed" });
    }
});

//This page is for both users, users can see all requests and admins can see all requests (like an audit log)
router.get("/auditlist", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const role = decodedToken.role;

        if (role === "user") {
            query.sender = accountNumber;
        }

        let query = { status: { $in: ["Pending", "Approved", "Rejected"] } };

        let collection = await requestsDb.collection("requests");
        let results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request failed" });
    }
});

//This page is for end users to create a request, this can be accessed by all
// In /create endpoint of request.mjs
router.post("/create", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token received:", token);  // Log the token for debugging

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
            console.log("Decoded token:", decodedToken);  // Log the decoded token for debugging
        } catch (error) {
            console.warn("Token verification failed:", error);
            return res.status(401).json({ message: "Invalid token" });
        }

        const accountNumber = decodedToken.accountNumber;
        const { amount, currency, recipient, code } = req.body;

        console.log("Request data received:", req.body); // Log incoming data

        // Validation checks and more logging
        if (amount < 0 || amount > 1000000 || !/^\d+$/.test(amount)) {
            console.error("Amount validation failed:", amount);
            return res.status(400).json({ message: "Amount is invalid" });
        }
        const validCurrencies = ["USD", "EUR", "GBP", "JPY", "CNY", "INR", "ZAR"];
        if (!validCurrencies.includes(currency)) {
            console.error("Currency validation failed:", currency);
            return res.status(400).json({ message: "Currency is invalid" });
        }
        if (!/^\d+$/.test(recipient) || recipient.length !== 10) {
            console.error("Recipient validation failed:", recipient);
            return res.status(400).json({ message: "Recipient account number is invalid" });
        }

        console.log("SWIFT code received:", code);  // Log the SWIFT code received

        // Validate SWIFT code
        if (!/^\d+$/.test(code) || code.length !== 8) {
            console.error("SWIFT code validation failed:", code);  // Log validation failure
            return res.status(400).json({ message: "SWIFT code is invalid" });
        }

        let newTransaction = {
            amount: amount,
            currency: currency,
            provider: "SWIFT",
            code: code,
            sender: accountNumber,  // sender comes from the decoded JWT
            recipient: recipient,   // recipient comes from the request body
            status: "Pending"
        };

        console.log("New transaction object:", newTransaction); // Log the new transaction object

        let collection = await requestsDb.collection("requests");
        let result = await collection.insertOne(newTransaction);
        console.log("Transaction inserted:", result); // Log insertion result

        res.status(201).json({
            amount,
            currency,
            provider: "SWIFT",
            code,
            sender: accountNumber,
            recipient,  // Return recipient as part of the response
            status: "Pending"
        });
    } catch (error) {
        console.error("Error during transaction creation:", error);
        res.status(500).json({ message: "Transaction creation failed" });
    }
});









// Command to view details of a sender/recipient
router.get("/details", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const role = decodedToken.role;
        const accountNumber = req.query.accountNumber; // Assuming account number is passed as a query parameter

        if (!accountNumber) {
            return res.status(400).json({ message: "Account number is required" });
        }

        let userCollection = await usersDb.collection("users");
        let user = await userCollection.findOne({ accountNumber: accountNumber });

        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        // If the role is "user", trick the user into thinking they found a 404 page
        if (role === "user") {
            return res.status(404).json({ message: "Invalid Page" });
        }

        // If the role is "admin", return the user details
        if (role === "admin") {
            return res.status(200).json(user);
        }

        // If the role is neither "user" nor "admin", return a forbidden status
        return res.status(403).json({ message: "Forbidden" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request failed" });
    }
});

//
router.post("/approve", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const role = decodedToken.role;

        // Check if the role is "admin"
        if (role !== "admin") {
            return res.status(404).json({ message: "Not authorized" });
        }

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const collection = await requestsDb.collection("requests");
        const result = await collection.updateOne(
            { _id: new ObjectId(_id), status: "Pending" },
            { $set: { status: "Approved" } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Request not found or already approved" });
        }

        res.status(200).json({ message: "Request approved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request approval failed" });
    }
});

//Commaand if the created request is rejected
router.post("/reject", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const role = decodedToken.role;

        // Check if the role is "admin"
        if (role !== "admin") {
            return res.status(404).json({ message: "Not authorized" });
        }

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const collection = await requestsDb.collection("requests");
        const result = await collection.updateOne(
            { _id: new ObjectId(_id), status: "Pending" },
            { $set: { status: "Rejected" } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Request not found or already rejected" });
        }

        res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request rejection failed" });
    }
});

export default router;