require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 10000; // Ensure Render's PORT matches

// Middleware
app.use(cors());
app.use(express.json());

// Load MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let db, lessons, orders; // ✅ Define orders collection

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
        db = client.db("ClassPlus1"); // 
        lessons = db.collection("lesson");
        orders = db.collection("order"); // ✅ Now orders is initialized
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!", error);
        process.exit(1);
    }
}
connectDB();

// ✅ Test Root Route
app.get('/', (req, res) => {
    res.send("🎉 ClassPlus API is Running!");
});

// ✅ Debugging Route
app.get('/test', (req, res) => {
    res.json({ message: "✅ Server is working!" });
});

// ✅ Get All Lessons Route
app.get('/lessons', async (req, res) => {
    console.log("📡 Received GET request on /lessons");
    try {
        if (!db) {
            console.log("❌ Database is not connected");
            return res.status(500).json({ error: "Database not connected" });
        }
        const allLessons = await lessons.find().toArray();
        res.json(allLessons);
    } catch (error) {
        console.error("❌ Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// ✅ Fetch all orders
app.get('/orders', async (req, res) => {
    try {
        console.log("📡 Received GET request on /orders");
        const allOrders = await orders.find().toArray(); // ✅ Orders collection is now properly initialized
        console.log("✅ Orders fetched:", allOrders);
        res.json(allOrders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));