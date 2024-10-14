import express from 'express';
import multer from 'multer';
import path from 'path';

import FileItem from '../models/file';

const fileupload = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the desired folder structure for storing files
    const folder = 'uploads';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

const upload = multer({ storage });

fileupload.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const { originalname, mimetype, size, filename } = req.file;
    const clientId = req.query.client_id;

    const fileItem = new FileItem({
      clientIdentifier: clientId,
      originalFilename: originalname,
      mimeType: mimetype,
      size,
      filePath: `uploads/${filename}`,
      createdBy: clientId
    });

    fileItem.save()
      .then(savedFile => {
        const { originalFilename, mimeType, size, filePath } = savedFile;
        res.status(200).send({
          uploaded_verification_file_details: { originalFilename, mimeType, size, filePath },
          message: 'File uploaded successfully.'
        });
      })
      .catch(error => {
        console.log(error)
      });
  } catch (error) {
    console.log(error)
  }
});

export default fileupload;