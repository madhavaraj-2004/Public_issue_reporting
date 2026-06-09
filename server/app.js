const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send({ ok: true, message: 'Public Issue Reporting API' });
});

app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  if (err && /Only image files are allowed/.test(err.message || '')) {
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }

  next();
});

module.exports = app;
