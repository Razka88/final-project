const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// 🔌 Import and use routes
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const adminRouter = require("./routes/admin");

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/admin", adminRouter);

// Test root route
app.get("/", (req, res) => {
    res.send("Backend is up and running and connected to MongoDB!");
});

// DB Connection + Server start
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    });
