const Complaint = require('../models/Complaint');
const User = require('../models/User');

const buildFilter = (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filter.$or = [{ title: regex }, { description: regex }, { location: regex }];
  }
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  return filter;
};

exports.listAll = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const limit = parseInt(req.query.limit || '0', 10);
    const query = Complaint.find(filter).populate('userId', 'name email profileImage').sort('-createdAt');
    if (limit > 0) query.limit(limit);
    const complaints = await query;
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignee } = req.body;
    const update = {};
    if (status) update.status = status;
    if (priority) update.priority = priority;
    if (assignee) update.assignee = assignee;
    const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
    if (complaint) {
      complaint.timeline = complaint.timeline || [];
      complaint.timeline.push({ status: complaint.status, note: `Status updated to ${complaint.status}`, createdAt: new Date() });
      complaint.updatedAt = new Date();
      await complaint.save();
    }
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.analytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const userCount = await User.countDocuments();
    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const latestReports = await Complaint.find({}).sort('-createdAt').limit(5).populate('userId', 'name email profileImage');
    const departmentSummary = byCategory.map((item) => ({ department: item._id, count: item.count }));
    res.json({ total, userCount, byStatus, byCategory, departmentSummary, latestReports });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
