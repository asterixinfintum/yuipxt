"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: false
  },
  token: {
    type: String,
    unique: true
  },
  online: {
    type: Boolean,
    "default": false
  }
});
var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;