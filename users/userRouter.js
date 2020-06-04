const express = require('express');
const db = require('./userDb');
const db2 = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try {
    const user = await db.insert(req.body);
    res.status(201).json(user);
  } catch(err) {
    res.status(500).json({ error: "Problem posting user to the database" });
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const post = await db2.insert({...req.body, user_id: req.user.id });
    res.status(201).json(post);
  } catch(err) {
    res.status(500).json({ error: "Problem inserting post to the database" });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ error: "Problem getting users from the database"});
  }
  
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const posts = await db.getUserPosts(req.user.id);
    res.status(200).json(posts);
  } catch(err) {
    res.status(500).json({ error: "Problem getting posts from the database" });
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const deleted = await db.remove(req.user.id);
    res.status(200).json(deleted);
  } catch(err) {
    res.status(500).json({ error: "Problem removing user from the database" });
  }
});

router.put('/:id', validateUser, validateUserId, async (req, res) => {
  try {
    const user = await db.update(req.user.id, req.body);
    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ error: "Problem updating user from the database" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const user = await db.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "invalid user id" });
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(500).json({message: "error retrieving user from database"});
  }
 
}

function validateUser(req, res, next) {
  if(!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing user data" });
  }
  if(!req.body.name) {
    return res.status(400).json({ message: "missing required name field" });
  }
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
