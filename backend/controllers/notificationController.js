const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiverId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('senderId', 'name avatar')
            .populate('postId', 'content');

        return sendSuccess(res, 200, 'Notifications fetched', { notifications });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
const markRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return sendError(res, 404, 'Notification not found');

        if (notification.receiverId.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized');
        }

        notification.readStatus = true;
        await notification.save();
        return sendSuccess(res, 200, 'Notification marked as read');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { receiverId: req.user._id, readStatus: false },
            { readStatus: true }
        );
        return sendSuccess(res, 200, 'All notifications marked as read');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            receiverId: req.user._id,
            readStatus: false,
        });
        return sendSuccess(res, 200, 'Unread count', { count });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { getNotifications, markRead, markAllRead, getUnreadCount };