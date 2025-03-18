const express = require("express");
const fs = require("fs");
const body_parser = require("body-parser");
const cors = require("cors");
const path = require('path');
const multer = require("multer");
PORT = 3000;

const app = express();
app.use(cors());

app.use(body_parser.json());
app.use(express.static(__dirname)); // Root directory

const USERS_FILE = path.join(__dirname, "json", "users.json"); // Use the correct path to the json folder
const LISTINGS_FILE = path.join(__dirname, "json", "listings.json");
const IMG_DIR = path.join(__dirname, "img");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMG_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

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

app.post("/editlisting", upload.single("listing_image"), (req, res) => { 
    try {
        let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8"));
        const new_listing = req.body;

        console.log("New Listing:", new_listing); // Log the incoming listing

        // If an image is uploaded, include it in the new listing
        if (req.file) {
            new_listing.image = req.file.filename;
        } else {
            new_listing.image = null; // Or set a default image if no image is uploaded
        }

        // Add the new listing to the listings array
        listings.push(new_listing);

        // Write the updated listings back to the JSON file
        fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));

        res.status(200).json({ message: "Listing added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding listing." });
    }
});

app.post("/updateListings", upload.single("listing_image"), (req, res) => { 
    try {
        let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8"));
        const updated_listing = req.body;

        // Find the index of the listing to update based on property name and owner email
        const index = listings.findIndex(l => l.property_name === updated_listing.property_name && l.owner_email === updated_listing.owner_email);
        
        if (index !== -1) {
            // If an image was uploaded, update the image field
            if (req.file) {
                updated_listing.image = req.file.filename;
            } else {
                updated_listing.image = listings[index].image; // Keep existing image if no new image is uploaded
            }

            // Replace the old listing with the updated one
            listings[index] = updated_listing;

            // Write the updated listings
            fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));

            res.status(200).json({ message: "Listing updated successfully!" });
        } else {
            res.status(404).json({ message: "Listing not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating listing." });
    }
});

app.get('/get-listing', (res) => {
    try {
        // Read the listings file
        const listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, 'utf8'));
        const listing = listings[0];

        // If listing is found, send it as JSON
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ message: 'Error fetching listing data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});