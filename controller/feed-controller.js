const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

const Post = require('../models/post')
const User = require('../models/user')


exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 5;
    let totalItems;
    Post.find({ creator: req.userId }).countDocuments().then(count => {
        totalItems = count
        return Post.find({ creator: req.userId }).skip((currentPage - 1) * perPage).limit(perPage)
    }).then(posts => {
        res.status(200).json({
            message: 'fetched Successfully',
            posts: posts,
            totalItems: totalItems,
            nextPage: +currentPage + 1
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422
        throw error
    }
    if (!req.file) {
        const error = new Error('No image provided')
        error.statusCode = 422
        throw error
    }
    // console.log(req.file)
    const imageUrl = req.file.path.replace("\\", "/")
    const title = req.body.title
    const content = req.body.content
    let creator;
    let createdPost;
    // const imageUrl = req.body.imageUrl
    const post = new Post({
        title: title,
        content, content,
        creator: req.userId,
        imageUrl: imageUrl
    })
    post.save().then(result => {
        createdPost = result
        return User.findById(req.userId)

    }).then(user => {
        creator = user
        user.posts.push(post)
        return user.save()
    }).then(result => {
        res.status(201).json({
            message: 'post created successfully',
            post: createdPost,
            creator: { _id: creator._id, name: creator.name }
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findOne({ _id: postId, creator: req.userId }).then(post => {
        if (!post) {
            const error = new Error('Post not found')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'post fetched', post: post })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed. entered data is incorrect.')
        error.statusCode = 422
        throw error
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image
    if (req.file) {
        imageUrl = req.file.path
    }
    if (!imageUrl) {
        const error = new Error('No image is selected.')
        error.statusCode = 422
        throw error
    }
    Post.findOne({ _id: postId, creator: req.userId }).then(post => {
        if (!post) {
            const error = new Error('post not found')
            error.statusCode = 404
            throw error
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }
        post.title = title
        post.content = content
        post.imageUrl = imageUrl
        return post.save()
    }).then(result => {
        res.status(200).json({
            message: 'Post updated!',
            post: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findOne({ _id: postId, creator: req.userId }).then(post => {
        if (!post) {
            const error = new Error('Post not found')
            error.statusCode = 404
            throw error
        }
        clearImage(post.imageUrl)
        return Post.findByIdAndDelete(postId)

    }).then(result => {
        return User.findById(req.userId)
    }).then(user => {
        user.posts.pull(postId)
        return user.save()
    }).then(result => {
        res.status(200).json({ message: 'Post deleted' })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })

}
const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if (err) {
            console.log(err)
        }
    })
}