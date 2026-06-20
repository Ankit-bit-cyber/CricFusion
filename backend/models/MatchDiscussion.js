const mongoose = require('mongoose');

const matchDiscussionSchema = new mongoose.Schema(
    {
        matchId: { type: String, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: [300, 'Message cannot exceed 300 characters'],
        },
    },
    { timestamps: true }
);

matchDiscussionSchema.index({ matchId: 1, createdAt: -1 });

module.exports = mongoose.model('MatchDiscussion', matchDiscussionSchema);