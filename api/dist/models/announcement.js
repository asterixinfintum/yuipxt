"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var announcementSchema = new Schema({
  header: {
    type: String,
    required: true,
    unique: true
  },
  preview: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    "default": Date.now
  }
});
var Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;