const express = require('express');
const router = express.Router();
const { getLive, getMatch, getDiscussion, postDiscussion } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/live', protect, getLive);
router.get('/:id', protect, getMatch);
router.get('/:id/discussion', protect, getDiscussion);
router.post('/:id/discussion', protect, postDiscussion);

module.exports = router;
