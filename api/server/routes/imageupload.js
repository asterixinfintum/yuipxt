const express = require('express');
const imageupload = express.Router();
const multer = require('multer');
const path = require('path');
import sharp from 'sharp';

import FileItem from '../models/file';

async function deleteAllFileItems() {
  const deleteResult = await FileItem.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} FileItems.`);
}
//deleteAllFileItems();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Set up multer upload
const upload = multer({ storage });

imageupload.post('/imageupload', upload.single('photo'), async (req, res) => {
  if (!req.file && !req.body.photo) {
    return res.status(400).send('No photo uploaded.');
  }

  try {
     const { originalname, mimetype, size } = req.file;
     const clientId = req.query.client_id;

    if (mimetype === 'image/jpeg') {
      const fileItem = new FileItem({
        clientIdentifier: clientId,
        originalFilename: originalname,
        mimeType: mimetype,
        size,
        createdBy: clientId
      });
  
       const outputPath = `uploads/${fileItem._id}.jpeg`; 
       const jpegName = `${fileItem._id}.jpeg`;
  
       await sharp(req.file.path).toFormat('jpeg').toFile(outputPath);
       const metadata = await sharp(outputPath).metadata();
       const height = metadata.height;
       const width = metadata.width;
  
       fileItem.filePath = outputPath;
       fileItem.jpegName = jpegName;
       fileItem.height = height;
       fileItem.width = width;

       fileItem.save()
        .then(savedFile => {
          res.status(200).send({
            uploaded_verification_photo_details: { savedFile },
            message: 'Image uploaded successfully.'
          });
        })
        .catch(error => {
          console.log(error)
        })
    }
  } catch (error) {
    console.error('Error converting image:', error);
  }
});

export default imageupload;
