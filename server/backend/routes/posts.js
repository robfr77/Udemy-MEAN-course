const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('',
    checkAuth,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        console.log('POST /api/posts');
        const url = req.protocol + '://' + req.get('host');
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename
        });
        post.save()
            .then(createdPost => {
                res.status(201).json({
                    message: 'Post added successfully.',
                    post: {
                        ...createdPost,
                        id: createdPost._id
                    }
                });
            });
    });

router.put('/:id',
    checkAuth,
    multer({ storage: storage }).single('image'),
    (req, res, next) => {
        console.log('PUT by id: ', req.body.id);
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            imagePath = url + '/images/' + req.file.filename;
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        });
        console.log(post);
        Post.updateOne({ _id: req.params.id }, post).then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update successfull!'
            });
        });
    });

router.get('', (req, res) => {
    console.log('GET /api/posts');
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        // inefficient for extremely large DB 
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(docs => {
            fetchedPosts = docs;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        });
});

router.get('/:id', (req, res) => {
    console.log('GET by id: ', req.params.id);
    Post.findOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({
            _id: result.id,
            title: result.title,
            content: result.content,
            imagePath: result.imagePath
        });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    console.log('DELETE by id: ', req.params.id);
    Post.deleteOne({
        _id: req.params.id
    })
        .then((result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted! '
            });
        }));
});

module.exports = router;