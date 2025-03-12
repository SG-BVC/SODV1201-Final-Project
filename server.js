const express = require("express");
const fs = require("fs");
const body_parser = require("body-parser");
const cors = require("cors");
const { PORT } = require("./global");

const app = express();
app.use(cors());

app.use(body_parser.json());
app.use(express.static(__dirname)); // Root directory

const USERS_FILE = "json/users.json";

// Make it impossible to error for the json file's status
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
}

// Sign-up submissoins
app.post("/signup", (req, res) => {
    const new_user = req.body;

    // Check existing users
    let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    // Check if email already exists
    if (users.some(user => user.email === new_user.email)) {
        return res.status(400).json({ message: "Email already registered." });
    }

    // Add the new user
    users.push(new_user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.status(201).json({ message: "User registered successfully!" });
    // Might need error handling(?)
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});