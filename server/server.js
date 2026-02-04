// server/server.js
require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); 

// --- ROUTE IMPORTS ---
const lostItemRoutes = require('./routes/lostitemroutes');
// CORRECTED: Matched the case of the filename 'foundItemRoutes.js'
const foundItemRoutes = require('./routes/foundItemRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to the database

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTES ---
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/auth', authRoutes);

// A simple root route to confirm the API is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});