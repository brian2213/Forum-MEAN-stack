const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  post
    .save()
    .then(result => {
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
    })
    .catch(error => {
      res.status(500).json({ message: 'Creatring post failed' });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // console.log(post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      //console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Update success' });
      } else {
        res.status(401).json({ message: 'Update failed' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'update failed' });
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({ message: 'fail to fetch posts' });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'post not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'fail to fetch posts' });
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'post deleted' });
      } else {
        res.status(401).json({ message: 'unauthorized deleted' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'fail to fetch posts' });
    });
};
