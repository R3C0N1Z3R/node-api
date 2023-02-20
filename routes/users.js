const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/", (req, res, next) => {
    User.find()
        .select("forename surname")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        forename: doc.forename,
                        surname: doc.surname,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:2000/users/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        forename: req.body.forename,
        surname: req.body.surname
    })
    user.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Created user successfully",
                createdUser: {
                    forename: result.forename,
                    surname: result.surname,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:2000/users/" + result._id
                    }
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


router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select("forename surname")
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: "GET",
                        url: "https://localhost:2000/users"
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndUpdate(id, {$set: req.body}, {new: true})
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({error: err}))
});

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndDelete(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User was deleted successfully",
                request: {
                    type: "DELETE",
                    url: "http://localhost:2000/users"
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