// Import required modules
const express = require('express');
const Item = require('../models/Item'); // Import the Item model

// Create an Express router
const router = express.Router();

/**
 * @route   POST /api/items/save
 * @desc    Save a new webpage item
 * @access  Public
 */
router.post('/save', async (req, res) => {
  // Basic validation (more robust validation can be added)
  if (!req.body.url || !req.body.title) {
    return res.status(400).json({ msg: 'URL and Title are required.' });
  }

  try {
    // Create a new item instance from the request body
    const newItem = new Item({
      url: req.body.url,
      title: req.body.title,
      notes: req.body.notes || '', // Use notes if provided, else empty string
      thumbnail: req.body.thumbnail || '', // Use thumbnail if provided, else empty string
    });

    // Save the new item to the database
    const savedItem = await newItem.save();

    // Respond with the saved item
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error saving item:', err.message);
    // Send a generic server error response
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/items
 * @desc    Get all saved items
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all items from the database, sorted by dateSaved descending
    const items = await Item.find().sort({ dateSaved: -1 });
    // Respond with the fetched items
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    // Send a generic server error response
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete a saved item by its ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find the item by ID
    const item = await Item.findById(req.params.id);

    // If item doesn't exist, return 404 Not Found
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Remove the item from the database
    await item.deleteOne(); // Use deleteOne() on the document instance

    // Respond with a success message
    res.json({ msg: 'Item removed successfully' });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    // Check if the error is due to an invalid ObjectId format
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Item not found' });
    }
    // Send a generic server error response for other errors
    res.status(500).send('Server Error');
  }
});

// Export the router to be used in server.js
module.exports = router;