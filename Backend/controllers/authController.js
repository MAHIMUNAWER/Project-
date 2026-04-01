const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const safeUser = (u) => ({
  id: u._id, name: u.name, phone: u.phone,
  email: u.email, district: u.district,
  farmtype: u.farmtype, totalSales: u.totalSales, createdAt: u.createdAt,
});

// ── POST /api/auth/register ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, district, farmtype } = req.body;

    if (!name || !phone || !password)
      return res.status(400).json({ success: false, message: 'Name, phone and password are required.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    if (await User.findOne({ phone }))
      return res.status(409).json({ success: false, message: 'Phone number already registered.' });

    if (email && await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, phone, email, password, district, farmtype });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: genToken(user._id),
      user:  safeUser(user),
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ success: false, message: 'Phone/email and password are required.' });

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    }).select('+password');

    if (!user)
      return res.status(401).json({ success: false, message: 'No account found for that phone / email.' });

    if (!await user.matchPassword(password))
      return res.status(401).json({ success: false, message: 'Incorrect password.' });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: genToken(user._id),
      user:  safeUser(user),
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
