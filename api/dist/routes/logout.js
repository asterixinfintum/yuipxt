"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = _interopRequireDefault(require("../models/user"));
var _authenticateToken = _interopRequireDefault(require("../utils/authenticateToken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var logout = _express["default"].Router();
logout.get('/logout', _authenticateToken["default"], function (req, res) {
  var email = req.user.email;
  _user["default"].findOneAndUpdate({
    email: email
  },
  // Specify the user's ID or any other unique identifier
  {
    $unset: {
      token: ''
    }
  },
  // Specify the item you want to delete
  {
    "new": true
  }).then(function (updatedUser) {
    // Handle the updated user object after deletion
    //console.log('User with item deleted:', updatedUser);
    res.json({
      message: 'Logout successful.'
    });
  })["catch"](function (error) {
    console.error('Error deleting item from user:', error);
  });
});
var _default = exports["default"] = logout;