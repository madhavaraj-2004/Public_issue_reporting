const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { listAll, updateStatus, analytics } = require('../controllers/adminController');

router.use(auth, adminOnly);
router.get('/complaints', listAll);
router.put('/complaints/:id', updateStatus);
router.get('/analytics', analytics);

module.exports = router;
