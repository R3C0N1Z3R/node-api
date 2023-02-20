const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');


const Post = require("../models/post");
const User = require("../models/user");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "uploads/");
    },
    filename: function (req, file, cb){
        cb(null, new Date().toISOString().slice(0,10) + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
        cb(null, true);
    } else{
        cb(new Error("Image Type not supported"), false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
    Post.find()
        .select("title image user postImage")
        .populate("user")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                posts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        postImage: doc.postImage,
                        user: doc.user,
                        request: {
                            type: "GET",
                            url: "http://localhost:2000/posts/" + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", upload.single("postImage"), (req, res, next) => {
    console.log(req.file);
    User.findById(req.body.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            const post = new Post({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                postImage: req.file.path,
                user: req.body.userId
            });
            return post.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Post created",
                createdPost: {
                    _id: result._id,
                    title: result.title,
                    postImage: result.postImage,
                    user: result.user
                },
                request: {
                    type: "GET",
                    url: "http://localhost:2000/post/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/postId", (req, res, next) => {
    Post.findById(req.params.postId)
        .select("_id title postImage")
        .populate("user")
        .exec()
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }
            res.status(200).json({
                post: post,
                request: {
                    type: "GET",
                    url: "http://localhost:2000/posts"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


router.delete("/:postId", (req, res, next) => {
    const id = req.params.postId;
    Post.findByIdAndDelete(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Post was deleted successfully",
                request: {
                    type: "GET",
                    url: "http://localhost:2000/post"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;