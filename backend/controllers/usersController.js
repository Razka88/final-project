const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const registerSchema = require("../validation/user");

const registerUser = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) return res.status(409).json({ error: "Email already in use" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password, salt);
        value.password = hashedPassword;

        delete value.isAdmin;

        const newUser = new User(value);
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin, isBusiness: newUser.isBusiness },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            msg: "User registered successfully",
            userId: newUser._id,
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                isBusiness: newUser.isBusiness,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin, isBusiness: user.isBusiness },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isBusiness: user.isBusiness,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

module.exports = { registerUser, loginUser, getCurrentUser };
