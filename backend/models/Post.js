const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Post content is required'],
            maxlength: [500, 'Post cannot exceed 500 characters'],
        },
        image: {
            type: String,
            default: '',
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        hashtags: [{ type: String }],
        matchId: { type: String, default: '' },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
});

postSchema.index({ content: 'text', hashtags: 'text' });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);