const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(bodyParser.json()) //application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)
app.use((error, req, res, next) => {
    console.log(error)
    let status = error.statusCode
    const message = error.message
    const data = error.data
    if (!status) {
        status = 500
    }
    res.status(status).json({
        message: message,
        data: data
    })

})

mongoose.connect('mongodb://nisarh039:2GzAw43CL4Gxlk1n@ac-yu89zur-shard-00-00.2kuqfqr.mongodb.net:27017,ac-yu89zur-shard-00-01.2kuqfqr.mongodb.net:27017,ac-yu89zur-shard-00-02.2kuqfqr.mongodb.net:27017/messages?replicaSet=atlas-48caiw-shard-0&ssl=true&authSource=admin')
    .then(result => {
        app.listen(8080);
    }).catch(err => {
        console.log(err)
    })
