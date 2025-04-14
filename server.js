const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const path = require('path');
const multer = require("multer");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const PORT = 3000;
const uri = process.env.MONGO_URI; // MongoDB connection string
const client = new MongoClient(uri);

const app = express();
app.use(cors());

app.use(body_parser.json());
app.use(express.static(__dirname)); // Root directory

// I didn't want to use images on mongo's database in case for some reason I met my data limit from all the testing
// I have put everything else on mongo, and I can easily show that I can add the image to the database if needed
const IMG_DIR = path.join(__dirname, "img");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMG_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Connect to MongoDB
async function connectMongo() {
    await client.connect();
    console.log("Connected to MongoDB");
}
connectMongo().catch(err => console.error(err));

// The names for the data on Mongo
const db = client.db("TheDataTM");
const users_collection = db.collection("users");
const listings_collection = db.collection("listings");

// Sign-up submissions
app.post("/signup", async (req, res) => {
    const new_user = req.body;

    try {
        const user_exists = await users_collection.findOne({ email: new_user.email });

        if (user_exists) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // Insert the new user into MongoDB
        await users_collection.insertOne(new_user);
        res.status(201).json({ message: "User registered successfully! Redirecting..." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup." });
    }
});

// Login functionality
app.post("/login", async (req, res) => {
    const user_email = req.body.email;

    try {
        const user = await users_collection.findOne({ email: user_email });

        if (user) {
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: "Invalid email. Please sign up first." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during login." });
    }
});

// Edit listing submissions
app.post("/edit_listing", upload.single("listing_image"), async (req, res) => {
    try {
        const new_listing = req.body;

        if (req.file) {
            new_listing.image = req.file.filename;
        } else {
            new_listing.image = null;
        }

        // Insert new listing into MongoDB
        await listings_collection.insertOne(new_listing);
        res.status(200).json({ message: "Listing added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding listing." });
    }
});

// Delete a listing
app.delete("/delete_listing", async (req, res) => {
    try {
        const { title, email } = req.body;

        if (!title || !email) {
            return res.status(400).json({ message: "Title and email are required." });
        }

        const delete_result = await listings_collection.deleteOne({
            property_name: title,
            owner_email: email
        });

        if (delete_result.deletedCount === 0) {
            return res.status(404).json({ message: "Listing not found." });
        }

        res.status(200).json({ message: "Listing deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting listing." });
    }
});

// Update listing
app.post("/update_listings", async (req, res) => {
    try {
        const updated_listing = req.body;

        const existing_listing = await listings_collection.findOne({
            property_name: updated_listing.property_name,
            owner_email: updated_listing.owner_email
        });

        if (!existing_listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        // Keep existing image
        updated_listing.image = existing_listing.image;

        await listings_collection.updateOne(
            { _id: existing_listing._id },
            { $set: updated_listing }
        );

        res.status(200).json({ message: "Listing updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating listing." });
    }
});

// Fetch listing
app.get('/get_listing', async (req, res) => {
    try {
        const listings = await listings_collection.findOne({});
        if (listings) {
            res.json(listings);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ message: 'Error fetching listing data' });
    }
});

// Fetch all listings
app.get("/get_listings", async (req, res) => {
    const listings = await listings_collection.find().toArray();
    res.json(listings);
});

// Fetch all users
app.get("/get_users", async (req, res) => {
    try {
        const users = await users_collection.find().toArray();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

// Start the server
app.listen(PORT, () => {
    // console.log(`Server running on http://localhost:${PORT}`);
    console.log('Server connected to Mongo and running');
});
