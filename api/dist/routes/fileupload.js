"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _file = _interopRequireDefault(require("../models/file"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var fileupload = _express["default"].Router();
var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    // Set the desired folder structure for storing files
    var folder = 'uploads';
    cb(null, folder);
  },
  filename: function filename(req, file, cb) {
    // Generate a unique filename for the uploaded file
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var extension = _path["default"].extname(file.originalname);
    var filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});
var upload = (0, _multer["default"])({
  storage: storage
});
fileupload.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    var _req$file = req.file,
      originalname = _req$file.originalname,
      mimetype = _req$file.mimetype,
      size = _req$file.size,
      filename = _req$file.filename;
    var clientId = req.query.client_id;
    var fileItem = new _file["default"]({
      clientIdentifier: clientId,
      originalFilename: originalname,
      mimeType: mimetype,
      size: size,
      filePath: "uploads/".concat(filename),
      createdBy: clientId
    });
    fileItem.save().then(function (savedFile) {
      var originalFilename = savedFile.originalFilename,
        mimeType = savedFile.mimeType,
        size = savedFile.size,
        filePath = savedFile.filePath;
      res.status(200).send({
        uploaded_verification_file_details: {
          originalFilename: originalFilename,
          mimeType: mimeType,
          size: size,
          filePath: filePath
        },
        message: 'File uploaded successfully.'
      });
    })["catch"](function (error) {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
});
var _default = exports["default"] = fileupload;