const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, followUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, uploadAvatar.single('avatar'), updateUserProfile);
router.put('/:id/follow', protect, followUser);

module.exports = router;
