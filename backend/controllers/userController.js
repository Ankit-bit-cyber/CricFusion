const User = require('../models/User');
const Post = require('../models/Post');
const { createNotification } = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get user profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'name avatar')
            .populate('following', 'name avatar');

        if (!user) return sendError(res, 404, 'User not found');

        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');

        return sendSuccess(res, 200, 'User profile fetched', {
            user: user.toPublicJSON(),
            posts,
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
const updateUserProfile = async (req, res) => {
    try {
        if (req.params.id !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized to update this profile');
        }

        const { name, bio, favoriteTeam } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (favoriteTeam !== undefined) updateData.favoriteTeam = favoriteTeam;
        if (req.file) updateData.avatar = req.file.path;

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        return sendSuccess(res, 200, 'Profile updated', { user: user.toPublicJSON() });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Follow / unfollow user
// @route   PUT /api/users/:id/follow
const followUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return sendError(res, 400, 'You cannot follow yourself');
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return sendError(res, 404, 'User not found');

        const currentUser = await User.findById(req.user._id);
        const isFollowing = currentUser.following.includes(req.params.id);

        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
            return sendSuccess(res, 200, 'Unfollowed successfully');
        } else {
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });

            await createNotification({
                senderId: req.user._id,
                receiverId: req.params.id,
                type: 'follow',
                message: `${currentUser.name} started following you`,
            });

            return sendSuccess(res, 200, 'Followed successfully');
        }
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Search users
// @route   GET /api/users/search?q=
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return sendError(res, 400, 'Search query is required');

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
            ],
        }).select('name email avatar bio').limit(20);

        return sendSuccess(res, 200, 'Search results', { users });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { getUserProfile, updateUserProfile, followUser, searchUsers };