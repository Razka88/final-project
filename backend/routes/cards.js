const express = require("express");
const router = express.Router();
const path = require("path");
const {
    getAllCards,
    getCardById,
    createCard,
    updateCard,
    deleteCard,
    toggleLike,
    getMyCards
} = require(path.resolve(__dirname, "../controllers/cardsController.js"));
const { verifyToken, isBusiness, isBusinessOrAdmin } = require("../middleware/auth");

// Public routes
router.get("/", getAllCards); // GET /cards - Get all cards
router.get("/:id", getCardById); // GET /cards/:id - Get single card

// Protected routes
router.post("/", verifyToken, isBusiness, createCard); // POST /cards - Create (Business only)
router.put("/:id", verifyToken, isBusinessOrAdmin, updateCard); // PUT /cards/:id - Edit (Owner or Admin)
router.delete("/:id", verifyToken, isBusinessOrAdmin, deleteCard); // DELETE /cards/:id - Delete (Owner or Admin)
router.patch("/:id/like", verifyToken, toggleLike); // PATCH /cards/:id/like - Toggle like
router.get("/my/cards", verifyToken, isBusiness, getMyCards); // GET /cards/my/cards - Get my cards

module.exports = router;

