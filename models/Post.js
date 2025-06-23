const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Comment = require('./Comment');

const PostSchema = new mongoose.Schema(
    {
        name: String,
        content: String,
        comments: [{ type: ObjectId, ref: 'Comment' }],
        likes: [{ type: ObjectId }],
    }, { timestamps: true }
);

PostSchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
        await Comment.deleteMany({ _id: { $in: doc.comments } });
    }
    next();
});

PostSchema.index({
    name: 'text',
});
const Post = mongoose.model('Post', PostSchema)

module.exports = Post