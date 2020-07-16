const express = require('express');
const db = require('../posts/postDb');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.get();
    res.status(200).json(posts);
  } catch(err) {
    res.status(500).json({ error: "Problem getting posts from the database" });
  }
});

router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await db.getById(req.post);
    res.status(200).json(post);
  } catch(err) {
    res.status(500).json({ error: "Problem getting post from the database" });
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const post = await db.remove(req.post);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Problem deleting post from the database" });
  }
});

router.put('/:id', validatePostId, validatePost, async (req, res) => {
  try {
    const post = await db.update(req.post, req.body);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Problem changing post in the database" });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const post = await db.getById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "invalid post id" });
  }
  req.post = req.params.id;
  next();
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing post data" });
  }
  if (!req.body.text) {
    return res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
