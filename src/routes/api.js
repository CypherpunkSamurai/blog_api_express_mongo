// Routing
const router = require('express').Router();

// Base
const { Post, Comment } = require('../../api/schema');
const { isBaseConnected } = require('../../api/base');
const { CHECKS_ENABLED } = require('../../config');




/*
    Util Functions
*/

function checkBaseConnection(res) {
    // Check if db is connected
    if (!isBaseConnected()) {
        return res.status(400).json({ error: "DB_NOT_CONNECTED" });
    }
}

function handleError(res, e, tag="") {
    // Returns Error if 
    if (tag) tag = `:${tag}`
    // Log
    console.log(`[route:api${tag}] Error: ${e.message}`);
    return res.status(400).json({error: e.message});
}



/*

    Posts API

*/


router.get("/blogs", async (req, res) => {
    checkBaseConnection(res);
    try {
        // Return Posts
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (e) {
        handleError(res, e, 'posts');
    }
});


router.post("/blog/create", async (req, res) => {
    checkBaseConnection(res);
    // Create a New Post and Save
    try {
        // Check required parameters
        if (req.body.title == undefined || req.body.content == undefined) {
            return res.status(400).json({error: "TITLE_AND_CONTENT_REQUIRED"});
        }
        // New Post
        const post = await new Post(
            {
                title: req.body.title,
                content: req.body.content,
            })
            .save();
        // Add Post
        return res.status(200).json(post);
    } catch (e) {
        handleError(e,res, 'post:create');
    }
});

router.get("/blog/:id", async (req,res) => {
    // Check if db is connected
    checkBaseConnection(res);
    // Return Post
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Set value
        blog_id = req.params.id.toString();
        // Return the Blog
        let post = await Post.findById(blog_id);
        // Check if not found
        if (post === null) {
            return res.status(404).json({error: "POST_NOT_FOUND"});
        }
        // Got our post
        return res.status(200).send(post);
    } catch (e) {
        handleError(e,res, 'post:get');
    }
    
});

router.put("/blog/update", async (req, res) => {
    checkBaseConnection(res);
    // Update
    try {
        // Check if :id is valid
        if (!req.body.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.body.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Read id
        const blog_id = req.body.id;
        const post = await Post.findById(blog_id);
        // Update feilds
        if (req.body.title) post.title = req.body.title;
        if (req.body.content) post.content = req.body.content;
        // Save Post
        await post.save();
        // Return Post
        return res.status(200).json(post);
    } catch (e) {
        handleError(e,res, 'post:put');
    }
});

router.delete("/blog/:id", async (req, res) => {
    checkBaseConnection(res);
    // 
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Parse ID 
        let blog_id = req.params.id;
        let post = await Post.deleteOne({_id: blog_id})
        // Also delete the posts comments
        let comments = await Comment.deleteMany({post_id: blog_id});
        // Security Checks
        if (post["deletedCount"] == 0) {
            return res.status(404).json({error: "POST_NOT_FOUND"});
        }
        // return delete message
        return res.status(200).json(post);
    } catch (e) {
        handleError(e,res, 'post:delete');
    }
    
});







/*

    Comments API

*/

router.get("/blog/:id/comments", async (req, res) => {
    checkBaseConnection(res);
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Parse ID 
        let blog_id = req.params.id;
        if (await Post.findById(blog_id) === null) {
            return res.status(404).json({error: "POST_NOT_FOUND"});
        }
        // Get Comments by post
        let comments = await Comment.find({post_id: blog_id});
        // Return Comments
        return res.status(200).json({blog_id: blog_id, comments: comments});
    } catch (e) {
        handleError(e,res, 'comments');
    }
});

router.post("/blog/:id/comment/add", async (req, res) => {
    checkBaseConnection(res);
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Parse ID 
        let blog_id = req.params.id;
        // New Comment
        if (req.body.content === undefined) {
            return res.status(400).json({error: "COMMENT_CONTENT_REQUIRED"});
        }
        // Create a new comment and save
        let comment = await new Comment({
            post_id: blog_id,
            content: req.body.content,
            username: req.body.username
        }).save();
        return res.status(200).json(comment);
    } catch (e) {
        handleError(res, e, 'comment:add');
    }
});

router.get("/blog/:id/comment/:cid", async (req, res) => {
    checkBaseConnection(res);
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_ID"});
        }
        // Parse ID 
        let blog_id = req.params.id;
        // Check if :cid is valid
        if (!req.params.cid) {
            return res.status(400).json({error: "COMMENT_ID_REQUIRED"});
        } else if (req.params.cid.length !== 24) {
            return res.status(400).json({error: "INVALID_COMMENT_ID"});
        }
        // Parse Comment ID
        let comment_id = req.params.cid;
        // Create a new comment and save
        const comment = await Comment.findOne({post_id: blog_id, _id: comment_id});
        // Check if comment if not found
        if (comment === null) {
            return res.status(404).json({error: "COMMENT_NOT_FOUND"});
        }
        return res.status(200).json(comment);
    } catch (e) {
        handleError(res, e, 'comment:get');
    }
});

router.put("/blog/:id/comment/:cid", async (req, res) => {
    checkBaseConnection(res);
    // Update Comment
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_POST_ID"});
        }
        // Read id
        let blog_id = req.params.id;
        // Check if :cid is valid
        if (!req.params.cid) {
            return res.status(400).json({error: "COMMENT_ID_REQUIRED"});
        } else if (req.params.cid.length !== 24) {
            return res.status(400).json({error: "INVALID_COMMENT_ID"});
        }
        // Get Comment by :cid
        let comment_id = req.params.cid;
        const comment = await Comment.findOne({post_id: blog_id, _id: comment_id});
        // Edit Comment (only if username if same)
        if (CHECKS_ENABLED) {
            if (req.body.username !== comment.username) {
                return res.status(401).json({error: "CROSS_USER_COMMENT_EDIT_UNAUTHORZIED", message: "Unauthorized to edit other user's comments. Security Checks are enabled. set CHECKS_ENABLED config/env variable to 'false' to disable."});
            }
            if (req.body.post_id) {
                if (req.body.post_id !== blog_id) {
                    return res.status(401).json({error: "COMMENT_POST_ID_CHANGE_UNAUTHORZIED", message: "Unauthorized to edit comment's post_id. Security Checks are enabled. set CHECKS_ENABLED config/env variable to 'false' to disable."});
                }
            }
        }
        // Else we allow edit
        if (req.body.content) comment.content = req.body.content;
        if (req.body.username) comment.username = req.body.username;
        if (req.body.post_id) comment.post_id = req.body.post_id;
        // Save and Return Comment
        await comment.save();
        return res.status(200).json(comment);
    } catch (e) {
        handleError(res, e, 'comment:put');
    }
});

router.delete("/blog/:id/comment/:cid", async (req,res) => {
    checkBaseConnection(res);
    // Delete a comment
    try {
        // Check if :id is valid
        if (!req.params.id) {
            return res.status(400).json({error: "POST_ID_REQUIRED"});
        } else if (req.params.id.length !== 24) {
            return res.status(400).json({error: "INVALID_POST_ID"});
        }
        // Read id
        let blog_id = req.params.id;
        // Check if :cid is valid
        if (!req.params.cid) {
            return res.status(400).json({error: "COMMENT_ID_REQUIRED"});
        } else if (req.params.cid.length !== 24) {
            return res.status(400).json({error: "INVALID_COMMENT_ID"});
        }
        // Get Comment by :cid
        let comment_id = req.params.cid;
        const comment = await Comment.deleteOne({post_id: blog_id, _id: comment_id});
        // Security Checks
        if (comment["deletedCount"] == 0) {
            return res.status(404).json({error: "COMMENT_NOT_FOUND"});
        }
        return res.status(200).json(comment);
    } catch (e) {
        handleError(res,e, 'comment:delete');
    }
});



/*
    Export the router
*/
module.exports = [
    router
];