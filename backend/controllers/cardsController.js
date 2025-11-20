const Card = require("../models/Card");
const cardSchema = require("../validation/card");

// GET /cards - Get all cards
const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find()
            .populate("createdBy", "firstName lastName email")
            .populate("likes", "firstName lastName")
            .sort({ createdAt: -1 });

        res.json({ cards });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /cards/:id - Get single card
const getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
            .populate("createdBy", "firstName lastName email")
            .populate("likes", "firstName lastName");

        if (!card) {
            return res.status(404).json({ error: "Business listing not found" });
        }

        res.json({ card });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// POST /cards - Create new card (Business only)
const createCard = async (req, res) => {
    try {
        const { error, value } = cardSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const newCard = new Card({
            ...value,
            createdBy: req.user.userId
        });

        await newCard.save();
        await newCard.populate("createdBy", "firstName lastName email");

        res.status(201).json({
            msg: "Business listing created successfully",
            card: newCard
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PUT /cards/:id - Update card (Owner or Admin only)
const updateCard = async (req, res) => {
    try {
        const { error, value } = cardSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: "Business listing not found" });
        }

        // Check if user is owner or admin
        if (card.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ error: "Access denied. You can only edit your own business listings." });
        }

        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true, runValidators: true }
        ).populate("createdBy", "firstName lastName email")
            .populate("likes", "firstName lastName");

        res.json({
            msg: "Business listing updated successfully",
            card: updatedCard
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// DELETE /cards/:id - Delete card (Owner or Admin only)
const deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: "Business listing not found" });
        }

        // Check if user is owner or admin
        if (card.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ error: "Access denied. You can only delete your own business listings." });
        }

        await Card.findByIdAndDelete(req.params.id);
        res.json({ msg: "Business listing deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PATCH /cards/:id/like - Toggle like/unlike
const toggleLike = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: "Business listing not found" });
        }

        const userId = req.user.userId;
        const isLiked = card.likes.includes(userId);

        if (isLiked) {
            // Unlike
            card.likes = card.likes.filter(like => like.toString() !== userId);
        } else {
            // Like
            card.likes.push(userId);
        }

        await card.save();
        await card.populate("likes", "firstName lastName");

        res.json({
            msg: isLiked ? "Business listing unliked" : "Business listing liked",
            card,
            isLiked: !isLiked
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /cards/my - Get user's own cards (Business only)
const getMyCards = async (req, res) => {
    try {
        const cards = await Card.find({ createdBy: req.user.userId })
            .populate("createdBy", "firstName lastName email")
            .populate("likes", "firstName lastName")
            .sort({ createdAt: -1 });

        res.json({ cards });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

module.exports = {
    getAllCards,
    getCardById,
    createCard,
    updateCard,
    deleteCard,
    toggleLike,
    getMyCards
};

