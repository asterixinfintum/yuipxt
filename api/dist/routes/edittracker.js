"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _editTracker = _interopRequireDefault(require("../models/editTracker"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var editTracker = _express["default"].Router();
editTracker.get('/trackers', function (req, res) {
  var masterkey = req.query.masterkey;
  try {
    if (masterkey && masterkey === process.env.masterKey) {
      if (req.query.clientEdited) {
        var clientEdited = req.query.clientEdited;
        _editTracker["default"].find({
          clientEdited: clientEdited
        }, function (err, editTrackers) {
          if (err) {
            console.error('Error fetching EditTracker documents:', err);
          } else {
            res.status(200).json({
              editTrackers: editTrackers
            });
          }
        });
      }
      if (req.query.editedBy) {
        var editedBy = req.query.editedBy;
        _editTracker["default"].find({
          editedBy: editedBy
        }, function (err, editTrackers) {
          if (err) {
            console.error('Error fetching EditTracker documents:', err);
          } else {
            res.status(200).json({
              editTrackers: editTrackers
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
var _default = exports["default"] = editTracker;