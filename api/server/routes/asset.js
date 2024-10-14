import express from 'express';

import Asset from '../models/asset';
import AllowedPair from '../models/allowedpair';

const asset = express.Router();

asset.get('/assets/', async (req, res) => {
    try {
        const assets = await Asset.find({});
        const assetlist = []

        //console.log(assets)

        assets.forEach(({ _id, name, coin, symbol, assetType, price, image, listed }) => {
            if (listed) {
                assetlist.push({ _id, name, coin, symbol, assetType, price, image, listed })
            }
        });

        res.status(200).json({ assets: assetlist });
    } catch (err) {
        console.error('Error retrieving assets:', err);
        res.status(500).json({ error: 'An error occurred while retrieving assets' });
    }
});

asset.get('/asset/', async (req, res) => {
    try {
        const { assetid } = req.query;

        // Check if baseCurrency is provided
        if (!assetid) {
            return res.status(400).send({ error: 'assetid is required' });
        }

        const asset = await Asset.findOne({ _id: assetid });
        const { _id, name, coin, symbol, assetType, price, image, listed, pricehistory } = asset;

        const result = {
            _id,
            name,
            coin,
            assetType,
            symbol,
            price,
            image,
            listed
            //pricehistory: pricehistory.slice(0, 20)
        }

        res.status(200).json({ asset: result });
    } catch (err) {
        console.error('Error retrieving assets:', err);
        res.status(500).json({ error: 'An error occurred while retrieving assets' });
    }
})

asset.post('/admin/create/asset', async (req, res) => {
    try {
        const { symbol, name, image, assetType } = req.body;

        const asset = {
            name,
            coin: symbol,
            symbol,
            assetType,
            price: '1',
            image
        }

        const newAsset = new Asset(asset);

        const savedAsset = await newAsset.save();

        res.status(200).json({ assetdetails: savedAsset })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while createing asset' });
    }
});

asset.post('/admin/create/allowedpair', async (req, res) => {
    try {
        const { type, pairlabel, pair } = req.body;

        const pairItem = {
            type,
            pairlabel,
            pair
        }

        const newPair = new AllowedPair(pairItem);
        const savedPair = await newPair.save();

        res.status(200).json({ savedPair });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating pair' });
    }
})

export default asset;