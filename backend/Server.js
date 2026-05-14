require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');
const authRoutes = require('./routes/auth');

// ── check if listings route file exists before requiring
let listingRoutes;
try {
  listingRoutes = require('./routes/listings');
} catch(e) {
  console.warn('⚠️  No listings route found, skipping.');
}

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// ── Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes
app.use('/api/auth', authRoutes);
if (listingRoutes) app.use('/api/listings', listingRoutes);

app.get('/', (req, res) => res.json({ message: '🌾 AgriShop API running!' }));

app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));