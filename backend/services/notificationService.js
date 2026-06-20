const Notification = require('../models/Notification');

const createNotification = async ({ senderId, receiverId, type, postId, message }) => {
    try {
        const notification = await Notification.create({
            senderId,
            receiverId,
            type,
            postId: postId || null,
            message,
        });

        // Emit via socket if available
        try {
            const { getIO } = require('../config/socket');
            const io = getIO();
            io.to(receiverId.toString()).emit('notification', {
                _id: notification._id,
                type,
                message,
                senderId,
                postId,
                createdAt: notification.createdAt,
            });
        } catch (_) { }

        return notification;
    } catch (error) {
        console.error('Notification creation error:', error.message);
    }
};

module.exports = { createNotification };