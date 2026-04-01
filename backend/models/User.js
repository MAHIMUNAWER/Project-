const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  phone:      { type: String, required: true, unique: true, trim: true },
  email:      { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6, select: false },
  district:   { type: String, default: '' },
  farmtype:   { type: String, default: '' },
  totalSales: { type: Number, default: 0 },
  createdAt:  { type: Date,   default: Date.now },
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
