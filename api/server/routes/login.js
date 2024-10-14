import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user';

const login = express.Router();

login.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user with the provided email and password
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.sendStatus(401); // Unauthorized
        }

        // Generate token
        const payload = {
            _id: user._id,
            email: user.email
        };
        const token = jwt.sign(payload, process.env.secretKeyJWT);

        // Update user with the token
        user.token = token;
        await user.save();

        // Respond with user data
        res.status(200).json({
            message: 'Login successful.',
            token,
            userData: {
                email: user.email,
                phonenumber: user.phonenumber,
                anonId: user.anonId,
                _id: user._id
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

export default login;