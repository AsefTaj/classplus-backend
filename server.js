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