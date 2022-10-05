const { Post } = require('../models/post.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const postsExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //check if the user exists before updete
  const post = await Post.findOne({ where: { id } });
  //if users DOESN'T exist, send error message
  if (!post) {
    return next(new AppError('post not find', 404));
  }
  req.post = post;
  next();
});

module.exports = { postsExists };
