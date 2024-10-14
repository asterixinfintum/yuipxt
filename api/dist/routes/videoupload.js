"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _file = _interopRequireDefault(require("../models/file"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var videoupload = express.Router();
var upload = multer({
  dest: 'uploads/'
});
videoupload.post('/videoupload', upload.single('video'), function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No video file provided'
      });
    }
    if (req.file.mimetype !== 'video/webm') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Invalid file format. Only webm videos are allowed.'
      });
    }
    var _req$file = req.file,
      originalname = _req$file.originalname,
      mimetype = _req$file.mimetype,
      size = _req$file.size;
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var extension = path.extname(req.file.originalname);
    var filename = req.file.originalname + '-' + uniqueSuffix + extension;
    var newPath = 'videos-directory/' + filename;
    fs.renameSync(req.file.path, newPath);
    var clientId = req.query.client_id;
    var fileItem = new _file["default"]({
      clientIdentifier: clientId,
      originalFilename: originalname,
      mimeType: mimetype,
      size: size,
      filePath: newPath,
      createdBy: clientId
    });
    fileItem.save().then(function (savedFile) {
      var originalFilename = savedFile.originalFilename,
        mimeType = savedFile.mimeType,
        size = savedFile.size,
        filePath = savedFile.filePath;
      res.status(200).send({
        uploaded_verification_video_details: {
          originalFilename: originalFilename,
          mimeType: mimeType,
          size: size,
          filePath: filePath
        },
        message: 'Video uploaded successfully.'
      });
    })["catch"](function (error) {
      console.log(error);
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred during registration.'
    });
  }
});
var _default = exports["default"] = videoupload;