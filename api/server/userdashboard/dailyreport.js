import express from 'express';

import User from '../models/user';
import UserDashboard from '../models/userdashboard';
import authenticateToken from '../utils/authenticateToken';

import { getIO } from '../socket';

const dailyreport = express.Router();

dailyreport.post('/user/dailyreport/showtailored', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { showtailored } = req.body;

        const userdash = await User.findOne({ _id: id });

        userdash.tailoreddashboard.showtailored = showtailored;

        await userdash.save();

        res.status(200).json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

dailyreport.post('/user/dailyreport/myprofitpercent', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { myprofitpercent } = req.body;

        const userdash = await User.findOne({ _id: id });
        userdash.tailoreddashboard.myprofitpercent = myprofitpercent;
        await userdash.save();
        res.status(200).json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

dailyreport.post('/user/dailyreport/myprofitvalue', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { myprofitvalue } = req.body;

        const userdash = await User.findOne({ _id: id });

        userdash.tailoreddashboard.myprofitvalue = myprofitvalue;

        await userdash.save()
        res.status(200).json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

dailyreport.post('/user/dailyreport/increasefromyesterday', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const { increasefromyesterday } = req.body;

        const userdash = await User.findOne({ _id: id });

        userdash.tailoreddashboard.increasefromyesterday = increasefromyesterday;

        await userdash.save();
        res.status(200).json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

dailyreport.post('/user/dailyreport/autotrademarketstate', authenticateToken, async (req, res) => {
    //profit or loss
    //percentage, graph and figure
    try {
        const { id } = req.query;
        const { autotrademarketstate } = req.body;

        if (id) {
            const userdash = await User.findOne({ _id: id });
            userdash.tailoreddashboard.autotrademarketstate = autotrademarketstate;
            await userdash.save();
            res.status(200).json({ message: 'done' })
        } else {

        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

dailyreport.post('/dailyreport/user/view', async (req, res) => {
    //general or tailored view
    const { user } = req.query;
});

export default dailyreport;