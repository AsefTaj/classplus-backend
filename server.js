require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // ✅ Apply CORS only once
app.use(express.json());

// Load MongoDB URI from .env file
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!", error);
        process.exit(1); // Stop server if database connection fails
    }
}
connectDB();

// Database & Collections
const db = client.db("classplus");
const lessons = db.collection("lesson");
const orders = db.collection("order");

// Ensure 10 lessons exist in MongoDB
async function ensureLessonsExist() {
    try {
        const existingLessons = await lessons.countDocuments();
        if (existingLessons === 0) {
            console.log("⚠️ No lessons found, inserting default lessons...");
            await lessons.insertMany([
                { topic: "Mathematics", location: "New York", price: 100, spaces: 5 },
                { topic: "English", location: "Los Angeles", price: 90, spaces: 5 },
                { topic: "Physics", location: "Chicago", price: 120, spaces: 5 },
                { topic: "Chemistry", location: "Houston", price: 110, spaces: 5 },
                { topic: "Biology", location: "Miami", price: 105, spaces: 5 },
                { topic: "Psychology", location: "San Francisco", price: 95, spaces: 5 },
                { topic: "History", location: "Boston", price: 85, spaces: 5 },
                { topic: "Music", location: "Seattle", price: 80, spaces: 5 },
                { topic: "Geography", location: "Denver", price: 75, spaces: 5 },
                { topic: "Finance", location: "Atlanta", price: 130, spaces: 5 }
            ]);
            console.log("✅ Default lessons inserted!");
        }
    } catch (error) {
        console.error("❌ Error inserting default lessons:", error);
    }
}

// Call this function on server start
ensureLessonsExist();

// API Routes

// Get all lessons
app.get('/lessons', async (req, res) => {
    try {
        const allLessons = await lessons.find().toArray();
        res.json(allLessons);
    } catch (error) {
        console.error("❌ Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// Create a new order
app.post('/orders', async (req, res) => {
    try {
        const newOrder = req.body;
        await orders.insertOne(newOrder);
        res.json({ message: "✅ Order placed successfully!" });
    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));