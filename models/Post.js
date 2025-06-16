const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new mongoose.Schema(
    {
        title: String,
        content:String,
        comments:[{ type:ObjectId, ref: 'Comment'}]
    }, { timestamps: true })