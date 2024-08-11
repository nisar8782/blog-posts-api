
const express = require('express')
const { check, body } = require('express-validator')

const authController = require('../controller/auth-controller')
const User = require('../models/user')


const router = express.Router()

router.put('/signup',
    body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail alreday exist')
            }
        })
    }),
    body('password').trim().isLength({ min: 5 }).withMessage('password must be atleast 5 characters long'),
    body('name').trim().not().isEmail().withMessage('name cannot be an email'),
    authController.signup
)

router.post('/login', authController.login)

module.exports = router