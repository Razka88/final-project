const User = require("../models/User");
const Card = require("../models/Card");

// GET /admin/users - Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// DELETE /admin/users/:id - Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ error: "Cannot delete your own account" });
        }

        // Delete all cards created by this user
        await Card.deleteMany({ createdBy: user._id });

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: "User and their business listings deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PATCH /admin/users/:id/toggle-admin - Toggle admin status (Admin only)
const toggleAdminStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent admin from changing their own status
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ error: "Cannot change your own admin status" });
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.json({
            msg: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isBusiness: user.isBusiness
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /admin/stats - Get admin dashboard stats (Admin only)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCards = await Card.countDocuments();
        const businessUsers = await User.countDocuments({ isBusiness: true });
        const adminUsers = await User.countDocuments({ isAdmin: true });

        const recentUsers = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentCards = await Card.find()
            .populate("createdBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalCards,
                businessUsers,
                adminUsers
            },
            recentUsers,
            recentCards
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    toggleAdminStatus,
    getAdminStats
};

