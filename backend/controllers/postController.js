const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { createNotification } = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { extractHashtags } = require('../utils/validators');

// @desc    Get all posts (feed)
// @route   GET /api/posts
const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name avatar')
            .populate({ path: 'comments', populate: { path: 'userId', select: 'name avatar' } });

        const total = await Post.countDocuments();

        return sendSuccess(res, 200, 'Feed fetched', {
            posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Create post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        const { content, matchId } = req.body;
        const hashtags = extractHashtags(content);
        const image = req.file ? req.file.path : '';

        const post = await Post.create({
            userId: req.user._id,
            content,
            image,
            hashtags,
            matchId: matchId || '',
        });

        const populated = await Post.findById(post._id).populate('userId', 'name avatar');
        return sendSuccess(res, 201, 'Post created', { post: populated });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return sendError(res, 404, 'Post not found');
        if (post.userId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized');
        }

        const { content } = req.body;
        post.content = content || post.content;
        post.hashtags = extractHashtags(post.content);
        if (req.file) post.image = req.file.path;

        await post.save();
        const populated = await Post.findById(post._id).populate('userId', 'name avatar');
        return sendSuccess(res, 200, 'Post updated', { post: populated });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return sendError(res, 404, 'Post not found');
        if (post.userId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized');
        }

        await Comment.deleteMany({ postId: post._id });
        await post.deleteOne();
        return sendSuccess(res, 200, 'Post deleted');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Like / unlike post
// @route   PUT /api/posts/:id/like
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return sendError(res, 404, 'Post not found');

        const isLiked = post.likes.includes(req.user._id);
        if (isLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
            if (post.userId.toString() !== req.user._id.toString()) {
                await createNotification({
                    senderId: req.user._id,
                    receiverId: post.userId,
                    type: 'like',
                    postId: post._id,
                    message: `${req.user.name} liked your post`,
                });
            }
        }

        await post.save();
        return sendSuccess(res, 200, isLiked ? 'Post unliked' : 'Post liked', {
            likes: post.likes,
            liked: !isLiked,
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'name avatar')
            .populate({ path: 'comments', populate: { path: 'userId', select: 'name avatar' } });

        if (!post) return sendError(res, 404, 'Post not found');
        return sendSuccess(res, 200, 'Post fetched', { post });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Search posts by hashtag
// @route   GET /api/posts/search?q=
const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return sendError(res, 400, 'Search query is required');

        const posts = await Post.find({
            $or: [
                { content: { $regex: q, $options: 'i' } },
                { hashtags: { $in: [q.toLowerCase()] } },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('userId', 'name avatar');

        return sendSuccess(res, 200, 'Search results', { posts });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { getFeed, createPost, updatePost, deletePost, likePost, getPost, searchPosts };