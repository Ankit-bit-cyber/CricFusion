const express = require('express');
const router = express.Router();
const { getFeed, createPost, updatePost, deletePost, likePost, getPost, searchPosts } = require('../controllers/postController');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { postRules, commentRules, handleValidation } = require('../middleware/validate');

router.get('/', protect, getFeed);
router.get('/search', protect, searchPosts);
router.post('/', protect, upload.single('image'), postRules, handleValidation, createPost);
router.get('/:id', protect, getPost);
router.put('/:id', protect, upload.single('image'), postRules, handleValidation, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.get('/:postId/comments', protect, getComments);
router.post('/:postId/comments', protect, commentRules, handleValidation, addComment);

module.exports = router;