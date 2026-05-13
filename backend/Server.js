require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ message: '🌾 AgriShop API running!' }));

app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));