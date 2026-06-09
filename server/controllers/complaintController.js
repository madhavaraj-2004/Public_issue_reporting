const Complaint = require('../models/Complaint');

const buildTimeline = (status, note) => [{ status, note, createdAt: new Date() }];

const getUploadedImages = (req) => {
  const images = [];
  if (req.file) images.push(req.file.filename);
  if (req.files?.image?.length) images.push(...req.files.image.map((file) => file.filename));
  if (req.files?.images?.length) images.push(...req.files.images.map((file) => file.filename));
  return images;
};

const buildFilter = (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.userId) filter.userId = query.userId;
  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
    ];
  }
  if (query.location) {
    filter.location = new RegExp(query.location, 'i');
  }
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  return filter;
};

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const images = getUploadedImages(req);
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority: priority || 'Low',
      image: images[0] || undefined,
      images,
      userId: req.user._id,
      timeline: buildTimeline('Pending', 'Complaint created')
    });
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const filter = buildFilter({ ...req.query, userId: req.user._id });
    const complaints = await Complaint.find(filter).sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email profileImage')
      .populate('comments.userId', 'name email profileImage');
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.searchComplaints = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const results = await Complaint.find(filter).sort('-createdAt').limit(50);
    res.json(results);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateComplaint = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    const isOwner = String(complaint.userId) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

    const { title, description, category, location, priority } = req.body;
    const images = getUploadedImages(req);
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (location) complaint.location = location;
    if (priority) complaint.priority = priority;
    if (images.length) {
      complaint.images = [...(complaint.images || []), ...images];
      complaint.image = complaint.image || images[0];
    }
    complaint.updatedAt = new Date();
    complaint.timeline.push({ status: complaint.status, note: 'Complaint updated', createdAt: new Date() });
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    const isOwner = String(complaint.userId) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    complaint.comments.push({
      userId: req.user._id,
      userName: req.user.name,
      message,
      createdAt: new Date()
    });
    complaint.timeline.push({ status: complaint.status, note: 'New comment added', createdAt: new Date() });
    await complaint.save();
    const populated = await Complaint.findById(complaint._id).populate('comments.userId', 'name email profileImage');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCitizenStats = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    const total = await Complaint.countDocuments(filter);
    const pending = await Complaint.countDocuments({ ...filter, status: 'Pending' });
    const resolved = await Complaint.countDocuments({ ...filter, status: 'Resolved' });
    const recentActivities = await Complaint.find(filter).sort('-createdAt').limit(5);
    const progress = total ? Math.round((resolved / total) * 100) : 0;
    res.json({ total, pending, resolved, recentActivities, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('userId', 'name profileImage').sort('-createdAt').limit(6);
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
