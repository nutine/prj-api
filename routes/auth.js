const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Register route
router.post('/register', async (req, res) => { 
    try {
        // Check for existing user
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        // 1. Find the user
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }
 
        // 2. Compare password
        const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }
 
        // 3. Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // 4. Send successful response
        res.json({ token }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 });
 
 module.exports = router; 
