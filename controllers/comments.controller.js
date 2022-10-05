const { Comment } = require('../models/comment.model');
const { Post } = require('../models/post.model');
const { User } = require('../models/user.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    include: [
      { model: User, attributes: ['id', 'name'] },
      { model: Post, include: { model: User } },
    ],
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      comments,
    },
  });
  next();
});

const createComment = catchAsync(async (req, res, next) => {
  const { comment, postId } = req.body;
  const { protecSession } = req;
  const newComment = await Comment.create({
    comment,
    userId: protecSession.id,
    postId,
  });

  res.status(201).json({
    status: 'sucess',
    data: { newComment },
  });
  next();
});

const updateComment = catchAsync(async (req, res, next) => {
  const { newComment } = req.body;
  const { comment } = req;

  //update posts
  await comment.update({ comment: newComment });

  res.status(200).json({
    status: 'sucess',
    data: { comment },
  });
  next();
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'deleted' });

  res.status(204).json({ status: 'sucess' });
});

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};
