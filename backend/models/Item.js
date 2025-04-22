// Import mongoose
const mongoose = require('mongoose');

// Define the schema for saved items
const itemSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // URL is mandatory
  },
  title: {
    type: String,
    required: true, // Title is mandatory
  },
  notes: {
    type: String, // Notes are optional
    default: '',
  },
  thumbnail: {
    type: String, // Thumbnail URL is optional
    default: '',
  },
  dateSaved: {
    type: Date,
    default: Date.now, // Automatically set the date when saved
  },
});

// Create and export the Item model
module.exports = mongoose.model('Item', itemSchema);