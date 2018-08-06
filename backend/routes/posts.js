const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const postController = require('../controllers/post');

const extractFile = require('../middleware/file');

router.delete('/:id', checkAuth, postController.deletePost);

router.post('', checkAuth, extractFile, postController.createPost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.get('', postController.getPosts);

router.get('/:id', postController.getPost);

module.exports = router;
