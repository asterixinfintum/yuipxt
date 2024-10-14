const express = require('express');
const path = require('path');
const fs = require('fs');

import FileItem from '../models/file';

const fileretrieve = express.Router();

fileretrieve.get('/files', async (req, res) => {
  try {
    const allFileItems = await FileItem.find();
    res.status(200).json({
      files: allFileItems
    })
  } catch (error) {
    console.error('Error retrieving FileItems:', error);
    return [];
  }
});

fileretrieve.get('/file', async (req, res) => {
  const file_id = req.query.file_id;
  try {
    const fileItem = await FileItem.findById(file_id);
    const { jpegName } = fileItem
    console.log(jpegName)

    //res.status(200).sendFile(path.join(__dirname, 'uploads', jpegName));

    //res.status(200.).json({ filePath: fileItem.jpegName });
  } catch (error) {
    console.log(error);
  } 
})

export default fileretrieve;