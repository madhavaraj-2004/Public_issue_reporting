require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  const admin = await User.create({ name: 'Admin', email, password: hash, role: 'admin' });
  console.log('Admin created:', admin.email);
  process.exit(0);
};

createAdmin().catch(err => { console.error(err); process.exit(1); });
