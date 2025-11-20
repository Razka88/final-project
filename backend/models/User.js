const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
        default: "",
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        url: { type: String, default: "" },
        alt: { type: String, default: "" },
    },
    address: {
        state: { type: String, default: "" },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        zip: { type: Number },
    },
    isBusiness: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
