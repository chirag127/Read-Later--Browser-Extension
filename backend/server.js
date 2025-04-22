// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import API routes
const itemRoutes = require('./routes/items');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// --- Database Connection ---
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error('Error: MONGODB_URI is not defined in the .env file.');
    process.exit(1); // Exit if DB connection string is missing
}

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB Connected successfully.'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit on connection failure
    });

// --- API Routes ---
// Mount the item routes under the /api/items path
app.use('/api/items', itemRoutes);

// --- Basic Root Route (Optional) ---
app.get('/', (req, res) => {
    res.send('WebSaver Backend API is running.');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// --- Error Handling (Optional Basic) ---
// Handle 404 Not Found for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ msg: 'Route not found' });
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error' });
});