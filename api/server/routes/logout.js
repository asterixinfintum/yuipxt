import express from 'express';

import User from '../models/user';
import authenticateToken from '../utils/authenticateToken';

const logout = express.Router();

logout.get('/logout', authenticateToken, (req, res) => {

    const email = req.user.email;

    User.findOneAndUpdate(
        { email }, // Specify the user's ID or any other unique identifier
        { $unset: { token: '' } }, // Specify the item you want to delete
        { new: true }
    )
    .then(updatedUser => {
        // Handle the updated user object after deletion
        //console.log('User with item deleted:', updatedUser);
        res.json({ message: 'Logout successful.' });
    })
    .catch(error => {
        console.error('Error deleting item from user:', error);
    });
});

export default logout;