import express from 'express';

import authenticateToken from '../../utils/authenticateToken';

import UserWallet from '../../userwallet/models/wallet';
import User from '../../models/user';
import Asset from '../../models/asset';

import generatetoptraders from '../generatetoptraders';
import tradesboard from '../tradesboard';

const dashboardcontroller = express.Router();

dashboardcontroller.get('/userwallet/dashboard', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const userid = req.user._id;

            const dashboardbalances = await UserWallet.returnDashboardBalances(userid);

            res.status(200).send({ dashboardbalances });
        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

dashboardcontroller.get('/userwallet/dashboard/topassets', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const userid = req.user._id;

            const useritem = await User.findOne({ _id: userid });

            const topassets = useritem.tailoreddashboard.topassets.split(' || ');

            const foundAssets = [];

            for (const name of topassets) {
                const asset = await Asset.findOne({ name });

                if (asset) {
                    const { name, price, _id, assetType, image, coin } = asset;
                    let random = 1;
                    let randomtwo = generateRandomIntegerBetween(3, 8);
                    let volume = generateRandomIntegerBetween(400000, 10000000);
                    let percentageup = `${random}${randomtwo}`;


                    const assetitem = {
                        name,
                        price,
                        id: _id,
                        assetType,
                        image,
                        volume,
                        percentageup,
                        initials: coin
                    }

                    foundAssets.push(assetitem);
                }
            }

            res.status(200).send({ topassets: foundAssets });

        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

dashboardcontroller.get('/dashboard/gettoptraders', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const toptraders = await generatetoptraders();

            res.status(200).send({ toptraders });
        } catch (error) {
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

dashboardcontroller.get('/dashboard/gettradesboard', authenticateToken, async (req, res) => {
    if (req.user && req.user._id) {
        try {
            const tradesboardobj = await tradesboard();
            
            res.status(200).send({ tradesboardobj });
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'error updating dashboard' });
        }
    }
});

function generateRandomIntegerBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default dashboardcontroller;