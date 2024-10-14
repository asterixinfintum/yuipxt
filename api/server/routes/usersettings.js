import express from 'express';

import User from '../models/user';
import authenticateToken from '../utils/authenticateToken';

const usersettings = express();

usersettings.post('/settings/email', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const userId = req.user._id;
        const email = req.body.email;

        try {
            const user = await User.findByIdAndUpdate(userId, { email }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server error' });
        }
    }
});

usersettings.post('/settings/phonenumber', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const userId = req.user._id;
        const phonenumber = req.body.phonenumber;

        try {
            const user = await User.findByIdAndUpdate(userId, { phonenumber }, { new: true });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);

        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

usersettings.post('/settings/password', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        const userId = req.user._id;

        try {
            const { oldpassword, newpassword } = req.body;

            const user = await User.findOne({ _id: userId });

            if (user) {
                if (user.password === oldpassword) {
                    user.password = newpassword;

                    await user.save();

                    res.status(200).json({ message: 'password changed successfully' });
                } else {
                    res.status(404).json({ message: 'wrong password' });
                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server error' });
        }
    }
})

export default usersettings;