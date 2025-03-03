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

let db, lessons;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
        db = client.db("Classplus"); // Ensure database name matches Render settings
        lessons = db.collection("lesson");
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

// Start Express Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));