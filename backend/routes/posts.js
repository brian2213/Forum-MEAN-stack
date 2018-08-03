const express = require('express');
const Post = require('../models/post');
const router = express.Router();


router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'post deleted' });
  });
});

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'post send success',
      postId: result._id
    });
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update success' });
  });
});

router.get('', (req, res, next) => {
  Post.find().then(document => {
    res.status(200).json({
      message: 'posts send sucessfully',
      posts: document
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found' });
    }
  });
});

module.exports = router;
