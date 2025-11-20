const express = require("express");
const router = express.Router();
const path = require("path");
const {
    getAllUsers,
    deleteUser,
    toggleAdminStatus,
    getAdminStats
} = require(path.resolve(__dirname, "../controllers/adminController.js"));
const { verifyToken, isAdmin } = require("../middleware/auth");

// All admin routes require authentication and admin privileges
router.use(verifyToken, isAdmin);

// GET /admin/users - Get all users
router.get("/users", getAllUsers);

// DELETE /admin/users/:id - Delete user
router.delete("/users/:id", deleteUser);

// PATCH /admin/users/:id/toggle-admin - Toggle admin status
router.patch("/users/:id/toggle-admin", toggleAdminStatus);

// GET /admin/stats - Get admin dashboard stats
router.get("/stats", getAdminStats);

module.exports = router;

