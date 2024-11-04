import express from "express";
import  {usersDb, requestsDb} from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);


//This page is for all users, normal users will be able to 
router.get("/list", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
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
            query.accountNumber = accountNumber;
        }

        let collection = await requestsDb.collection("requests");
        let results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request failed" });
    }
});

//This page is for end users to create a request, this can be accessed by all
router.post("/create", async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header as a Bearer token
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secret_key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const accountNumber = decodedToken.accountNumber;
        const { amount, currency, recipiant } = req.body;

        if (amount < 0 || amount > 1000000 || !/^\d+$/.test(amount) || amount == null) {
            return res.status(400).json({ message: "Amount is invalid" });
        }

        const validCurrencies = ["USD", "EUR", "GBP", "JPY", "CNY", "INR", "CAD", "AUD", "SGD", "CHF", "MYR", "THB", "IDR", "SAR", "AED", "ZAR", "HKD", "PHP", "SEK", "NOK", "DKK", "NZD", "KRW", "RUB", "BRL", "TRY", "MXN", "PLN", "TWD", "ILS", "QAR", "CZK", "HUF", "CLP", "EGP", "COP", "ARS", "PHP", "VND", "PKR", "IQD", "KWD", "OMR", "NGN", "KES", "UGX", "GHS", "ZMW", "MAD", "DZD", "TND", "LYD", "JOD", "BHD", "LBP", "SYP", "YER", "SOS", "SDG", "MZN", "AOA"];
        if (!validCurrencies.includes(currency)) {
            return res.status(400).json({ message: "Currency is invalid" });
        }

        if (recipiant == null || recipiant.length !== 10 || !/^\d+$/.test(recipiant)) {
            return res.status(400).json({ message: "Recipiant is invalid" });
        }

        let newDocument = {
            amount: req.body.amount,
            currency: req.body.currency,
            provider: "SWIFT",
            sender: accountNumber, // Include the accountNumber here
            recipiant: req.body.recipiant,
            status: "Pending"
        };

        let collection = await requestsDb.collection("requests");
        let result = await collection.insertOne(newDocument);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Request failed" });
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



});

//Commaand if the created request is rejected
router.post("/reject", async (req, res) => {


});

export default router;