const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new mongoose.Schema(
    {
        text: { 
            type: String, 
            required: true 
        },
        userId: { 
            type: ObjectId, 
            ref: 'User', 
            required: true 
        },
        postId: { 
            type: ObjectId, 
            ref: 'Post', 
            required: true 
        },
        likes: [{
            type: ObjectId,
            ref: 'User'
        }]
    }, 
    { 
        timestamps: true 
    }
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;