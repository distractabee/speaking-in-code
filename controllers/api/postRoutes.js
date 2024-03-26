// Import necessary modules and initialize the Express.js router
const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// GET route to render the edit post page
router.get('/edit-post/:id', withAuth, async (req, res) => {
  try {
    // Find the post by ID
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    // Render the edit-post.handlebars view and pass the post data
    res.render('edit-post', {
      post: postData.get({ plain: true }),
      logged_in: req.session.logged_in,
      editing: true, // Set editing to true when rendering the edit post page
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    // Create a new post with the data from the request body
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(201).json(newPost); 
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT route to edit/update a post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    // Find the post by ID and update its content
    const updatedPost = await Post.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!updatedPost[0]) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE route to delete a post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // Delete a post where the ID matches and the user_id belongs to the logged-in user
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Export the router
module.exports = router;
