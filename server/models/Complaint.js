const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  images: [{ type: String }],
  location: { type: String },
  locationCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  priority: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Low' },
  status: { type: String, enum: ['Pending','Under Review','In Progress','Resolved','Closed'], default: 'Pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  timeline: [{
    status: { type: String },
    note: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
