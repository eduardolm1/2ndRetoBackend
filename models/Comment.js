const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        text: String
    }
)