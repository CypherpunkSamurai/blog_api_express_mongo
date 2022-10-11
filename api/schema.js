const mongo = require('mongoose');

// Comments Schema
const commentSchema = new mongo.Schema({
    post_id: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String,
        default: "Anonymous"
    },
    content: {
        required: true,
        type: String
    }
},
    // Enable Automated Timestamps
    { timestamps: true }
);


// Schema
const postSchema = new mongo.Schema({
    title: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    }
},
    // Enable Automated Timestamps
    { timestamps: true }
);




// Models
const Comment = mongo.model("comments", commentSchema, collection="comments")
const Post = mongo.model("posts", postSchema, collection="posts")

/*
    Exports
*/
module.exports = {
    Post, Comment
};