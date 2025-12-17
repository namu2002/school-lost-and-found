const path = require('path');
// Ensure the path to .env is correct (one level up from the server folder)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes 
// Note: Ensure the casing matches your folder names (e.g., 'Routes' vs 'routes')
const lostItemRoutes = require('./Routes/lostitemroutes');
const foundItemRoutes = require('./Routes/founditemroutes');
const authRoutes = require('./Routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware - CORS MUST BE FIRST
app.use(cors({ origin: '*' })); 

// 2. Body Parsers - Essential for POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 4. API Routes
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/auth', authRoutes);

// 5. Serve Static Files
// This serves your CSS, JS, and Images from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// 6. FIX: Catch-all route for Front-end SPA
// We use a regular expression (.*) to avoid the "Missing parameter name" error 
// caused by the '**' or '*' symbols in newer Express versions.
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 7. Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});