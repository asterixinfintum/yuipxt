import express from 'express';
import Asset from '../../models/asset';

const assets = express.Router();

assets.get('/asset/twentyfourhourchange', async (req, res) => {
    const { assetid } = req.query;

    if (!assetid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const assetitem = await Asset.findOne({ _id: assetid });

        const data = await assetitem.gettwentyfourhrchange();

        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching asset data' });
    }
});

assets.get('/asset/twentyfourhourhigh', async (req, res) => {
    const { assetid } = req.query;

    if (!assetid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const assetitem = await Asset.findOne({ _id: assetid });
        let data;

        const pricehistoryitem = await assetitem.gettwentyfourhrhigh();

        if (pricehistoryitem) {
            data = pricehistoryitem.price;
        }

        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching asset data' });
    }
});

assets.get('/asset/twentyfourhourlow', async (req, res) => {
    const { assetid } = req.query;

    if (!assetid) {
        return res.status(400).send({ error: 'Base currency is required' });
    }

    try {
        const assetitem = await Asset.findOne({ _id: assetid });
        let data;

        const pricehistoryitem = await assetitem.gettwentyfourhrlow();

        if (pricehistoryitem) {
            data = pricehistoryitem.price;
        }

        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching asset data' });
    }
});

export default assets;