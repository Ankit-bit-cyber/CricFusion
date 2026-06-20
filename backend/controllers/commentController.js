const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { createNotification } = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Add comment to post
// @route   POST /api/posts/:postId/comments
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return sendError(res, 404, 'Post not found');

        const comment = await Comment.create({
            postId: req.params.postId,
            userId: req.user._id,
            text: req.body.text,
        });

        const populated = await Comment.findById(comment._id).populate('userId', 'name avatar');

        if (post.userId.toString() !== req.user._id.toString()) {
            await createNotification({
                senderId: req.user._id,
                receiverId: post.userId,
                type: 'comment',
                postId: post._id,
                message: `${req.user.name} commented on your post`,
            });
        }

        return sendSuccess(res, 201, 'Comment added', { comment: populated });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return sendError(res, 404, 'Comment not found');

        if (comment.userId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized');
        }

        await comment.deleteOne();
        return sendSuccess(res, 200, 'Comment deleted');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');

        return sendSuccess(res, 200, 'Comments fetched', { comments });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { addComment, deleteComment, getComments };