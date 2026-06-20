const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'follow', 'match_alert'],
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: null,
        },
        message: { type: String, default: '' },
        readStatus: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.index({ receiverId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
