const express = require('express')
const { body } = require('express-validator')

const feedController = require('../controller/feed-controller')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

// POST /feed/post
router.post('/post', isAuth, [
    body('title').trim().isLength({ min: 5 }).withMessage('Title length must be greater than 5 charactors'),
    body('content').trim().isLength({ min: 5 }).withMessage('Content length must be greater than 5 charactors')
], feedController.createPost)

router.get('/post/:postId', isAuth, feedController.getPost)
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({ min: 5 }).withMessage('Title length must be greater than 5 charactors'),
    body('content').trim().isLength({ min: 5 }).withMessage('Content length must be greater than 5 charactors')
], feedController.updatePost)
router.delete('/post/:postId', isAuth, feedController.deletePost)
module.exports = router