const express = require('express');
const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

//middlewares
const { commentExists } = require('../middlewares/comments.middleware');
const {
  protecSession,
  protectComment,
} = require('../middlewares/auth.middlewares');

const commentsRouter = express.Router();

commentsRouter.use(protecSession);

commentsRouter.get('/', getAllComments);
commentsRouter.post('/', createComment);
commentsRouter.patch('/:id', commentExists, protectComment, updateComment);
commentsRouter.delete('/:id', commentExists, protectComment, deleteComment);

module.exports = { commentsRouter };
