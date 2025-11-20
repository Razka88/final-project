const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: 200,
        default: ""
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15
    },
    image: {
        url: { type: String, default: "" },
        alt: { type: String, default: "" }
    },
    address: {
        state: { type: String, default: "" },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        zip: { type: Number }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

// Index for better query performance
cardSchema.index({ createdBy: 1 });
cardSchema.index({ likes: 1 });

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;

