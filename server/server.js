// --- IMPORTS ---
const path = require('path');
// CORRECTED: Simplified dotenv configuration. It looks for .env in the root by default.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // CORRECTED: Path to db.js (inside server folder)

// --- ROUTE IMPORTS ---
const lostItemRoutes = require('./routes/lostitemroutes');
const foundItemRoutes = require('./routes/founditemroutes');
const authRoutes = require('./routes/authRoutes');

// --- APP INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE CONNECTION ---
// This function will connect to the database using the MONGO_URI from your .env file.
connectDB();

// --- CORE MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Used to parse URL-encoded bodies

// --- API ROUTES ---
// All API calls will be prefixed with /api
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/auth', authRoutes);

// --- FRONT-END INTEGRATION (IMPORTANT) ---
// This section serves the static files (like HTML, CSS, JS) from a 'public' or 'build' folder.
// This should come AFTER your API routes.

// Set static folder. The path goes up one level from 'server' to the root, then into 'public'.
app.use(express.static(path.join(__dirname, '..', 'public')));

// This "catch-all" route directs any request that is NOT an API call to your main HTML page.
// This is what allows a Single Page Application (like React) to handle its own routing.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});


// --- START SERVER ---
app.listen(PORT, () => {
    // This message confirms the server has started successfully.
    console.log(`🚀 Server is running on port ${PORT}`);
});
