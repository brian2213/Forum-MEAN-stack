const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');

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
    const name = file.originalname
      .toLocaleLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'post deleted' });
  });
});

router.post(
  '',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });

    post.save().then(result => {
      res.status(201).json({
        message: 'post send success',
        post: {
          id: result._id,
          // title: result.title,
          // content: result.content,
          // imagePath: result.imagePath

          ...result
        }
      });
    });
  }
);

router.put(
  '/:id',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
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
      //console.log(result);
      res.status(200).json({ message: 'Update success' });
    });
  }
);

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const curPage = +req.query.curPage;
  const postQuery = Post.find();
  let fetchedDoc;
  if (pageSize && curPage) {
    postQuery.skip(pageSize * (curPage - 1)).limit(pageSize);
  }
  postQuery
    .then(document => {
      fetchedDoc = document;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'posts send sucessfully',
        posts: fetchedDoc,
        maxPosts: count
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
