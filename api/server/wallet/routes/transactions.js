import express from 'express';

import Wallet from '../models/wllt';

import authenticateToken from '../../utils/authenticateToken';

const transactions = express.Router();

transactions.post('/convert', authenticateToken, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(404).send({ message: 'Not allowed' });
    }

    try {
        const { toquant, fromquant, assetfrom, assetto, wallet, total, transactionFee } = req.body;
        const wllt = await Wallet.findOne({ _id: wallet });

        if (!wllt) {
            return res.status(404).send({ message: 'Wallet not found' });
        }

        const result = await wllt.swap(toquant, fromquant, assetto, assetfrom, transactionFee);
        //console.log(result);
        res.status(201).send({ result });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(400).send({ error: 'An error occurred during the conversion.' });
    }
});

export default transactions;