import https from "https";
import fs from "fs";
import users from "./routes/user.mjs";
import express from "express";
import cors from "cors";

const PORT = 3000;
const app = express();

const options = {
    key: fs.readFileSync("keys/privatekey.pem"),
    cert: fs.readFileSync("keys/certificate.pem")
};

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});

app.use("/user", users);

let server = https.createServer(options, app);
console.log(`Server is running on port ${PORT}`);
server.listen(PORT); // Corrected to use `server.listen()`
