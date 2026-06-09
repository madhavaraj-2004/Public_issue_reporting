const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
	createComplaint,
	getMyComplaints,
	getComplaint,
	searchComplaints,
	updateComplaint,
	deleteComplaint,
	addComment,
	getCitizenStats,
	getRecentComplaints,
} = require('../controllers/complaintController');

router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), createComplaint);
router.get('/me', auth, getMyComplaints);
router.get('/stats/me', auth, getCitizenStats);
router.get('/recent', getRecentComplaints);
router.get('/search', searchComplaints);
router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), updateComplaint);
router.delete('/:id', auth, deleteComplaint);
router.post('/:id/comments', auth, addComment);
router.get('/:id', auth, getComplaint);

module.exports = router;
