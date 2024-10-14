const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

import FileItem from '../models/file';

const videoupload = express.Router();
const upload = multer({ dest: 'uploads/' });

videoupload.post('/videoupload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        if (req.file.mimetype !== 'video/webm') {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid file format. Only webm videos are allowed.' });
        }

        const { originalname, mimetype, size } = req.file;

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(req.file.originalname);
        const filename = req.file.originalname + '-' + uniqueSuffix + extension;

        const newPath = 'videos-directory/' + filename;

        fs.renameSync(req.file.path, newPath);
        const clientId = req.query.client_id;

        const fileItem = new FileItem({
            clientIdentifier: clientId,
            originalFilename: originalname,
            mimeType: mimetype,
            size,
            filePath: newPath,
            createdBy: clientId
        });

        fileItem.save().
            then(savedFile => {
                const { originalFilename, mimeType, size, filePath } = savedFile;
                res.status(200).send({
                    uploaded_verification_video_details: { originalFilename, mimeType, size, filePath },
                    message: 'Video uploaded successfully.'
                });
            })
            .catch(error => {
                console.log(error)
            });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

export default videoupload;