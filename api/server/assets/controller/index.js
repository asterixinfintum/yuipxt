import express from 'express';

import Asset from '../../models/asset';

const assetroute = express.Router();

assetroute.get('/assets/all', async (req, res) => {
    try {
        const { assettype } = req.query;

        let assets;

        if (assettype) {
            assets = await Asset.find({ assetType: assettype });
        } else {
            assets = await Asset.find();
        } 

        res.status(200).send({ assets });
    } catch {
        res.status(500).send({ error: 'error gettong assets' });
    }
});

export default assetroute;