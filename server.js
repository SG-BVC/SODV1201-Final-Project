const express = require("express");
const fs = require("fs");
const body_parser = require("body-parser");
const cors = require("cors");
const path = require('path');
PORT = 3000;

const app = express();
app.use(cors());

app.use(body_parser.json());
app.use(express.static(__dirname)); // Root directory

const USERS_FILE = path.join(__dirname, 'json', 'users.json'); // Use the correct path to the json folder
const LISTINGS_FILE = path.join(__dirname, "json", "listings.json");

app.post("/login", (req, res) => {
    const user_email = req.body.email;

    // Read existing users from the correct path
    let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    const user = users.find(user => user.email === user_email);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: "Invalid email. Please sign up first." });
    }
});

// Make it impossible to error for the json file's status
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
}
if (!fs.existsSync(LISTINGS_FILE)) {
    fs.writeFileSync(LISTINGS_FILE, "[]", "utf8");
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

    res.status(201).json({ message: "User registered successfully! Redirecting..." });
    // Might need error handling(?)
});

app.post("/login", (req, res) => {
    const user_email = req.body.email; // Email from the frontend

    // Read existing users
    let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    // Find the user with the provided email
    const user = users.find(user => user.email === user_email);

    if (user) {
        // If the user is found, send back a success response with the user data
        res.json({ success: true, user });
    } else {
        // If the user is not found, send a fail message
        res.json({ success: false, message: "Invalid email. Please sign up first." });
    }
});

app.post("/editlisting", (req, res) => {
    const new_listing = req.body;

    // Read existing listings
    let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8"));
    listings.push(new_listing);

    // Save updated listings
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));

    res.status(201).json({ message: "Listing added successfully!" });
});

app.post("/updateListings", (req, res) => {
    fs.writeFile(LISTINGS_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            console.error("Error updating listings.json:", err);
            return res.status(500).json({ success: false, message: "Failed to update listings." });
        }
        res.json({ success: true, message: "Listings updated successfully!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});