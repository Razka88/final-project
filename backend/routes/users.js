const express = require("express");
const router = express.Router();
const path = require("path");
const { registerUser, loginUser, getCurrentUser } = require(path.resolve(__dirname, "../controllers/usersController.js"));
const { verifyToken } = require("../middleware/auth");

// GET /users - test route
router.get("/", (req, res) => {
    res.send("GET all users — test route");
});

// POST /users - register
router.post("/", registerUser);

// POST /users/login - login
router.post("/login", loginUser);

// GET /users/me - get current user (protected)
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
