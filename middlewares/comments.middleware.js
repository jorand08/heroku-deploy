const { Comment } = require('../models/comment.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const commentExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //check if the user exists before updete
  const comment = await Comment.findOne({ where: { id } });
  //if users DOESN'T exist, send error message
  if (!comment) {
    return next(new AppError('comment not find', 404));
  }
  req.comment = comment;
  next();
});

module.exports = { commentExists };
