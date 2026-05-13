require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');
const authRoutes    = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve uploaded listing images
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));

// API routes
app.use('/api/auth',     authRoutes);
app.use('/api/listings', listingRoutes);

app.get('/', (req, res) => res.json({ message: '🌾 AgriShop API running!' }));

app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));