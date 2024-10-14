"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _require = require('mongodb'),
  ObjectId = _require.ObjectId;
function uniqueIdGenerate() {
  var timestamp = ObjectId().getTimestamp();
  var randomPart = Math.floor(Math.random() * 10000); // Generate a random number

  // Concatenate the timestamp and random part to form a unique number
  var uniqueNumber = parseInt(timestamp.getTime().toString() + randomPart.toString());
  return uniqueNumber;
}
var _default = exports["default"] = uniqueIdGenerate;