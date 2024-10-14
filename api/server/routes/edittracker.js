import express from 'express';

import EditTracker from '../models/editTracker';

const editTracker = express.Router();

editTracker.get('/trackers', (req, res) => {
    const masterkey = req.query.masterkey;

    try {
        if (masterkey && masterkey === process.env.masterKey) {
            if (req.query.clientEdited) {
                const clientEdited = req.query.clientEdited;
                
                EditTracker.find({ clientEdited }, (err, editTrackers) => {
                    if (err) {
                      console.error('Error fetching EditTracker documents:', err);
                    } else {
                      res.status(200).json({ editTrackers })
                    }
                });
            }

            if (req.query.editedBy) {
                const editedBy = req.query.editedBy;

                EditTracker.find({ editedBy }, (err, editTrackers) => {
                    if (err) {
                      console.error('Error fetching EditTracker documents:', err);
                    } else {
                        res.status(200).json({ editTrackers })
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

export default editTracker;