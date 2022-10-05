const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//models
const { User } = require('../models/user.model');

dotenv.config({ path: '/config.env' });

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const protecSession = catchAsync(async (req, res, next) => {
  //get token-- A travez de header
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //extrac token
    //req.headers.autorization = "Beare"
    token = req.headers.authorization.split(' ')[1]; //--> [bearer, token]
  }

  //check if the token was sent or not
  if (!token) {
    return next(new AppError('Invalid Token', 403));
  }

  //verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //verify the token´s

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of the session is no longer active', 403)
    );
  }

  //grant access
  req.protecSession = user;
  next();
});
//Check the sessionUser to compare to the one that wants to be updated/deleted

const protectUsersAccount = async (req, res, next) => {
  try {
    const { protecSession, user } = req;

    if (protecSession.id !== user.id) {
      return next(new AppError('You are not the owner of this account', 403));
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const protectPost = (req, res, next) => {
  const { protecSession, post } = req;

  if (protecSession.id !== post.userId) {
    return next(new AppError('You are not the owner of this post', 403));
  }
  next();
};

const protectComment = (req, res, next) => {
  const { protecSession, comment } = req;

  if (protecSession.id !== comment.userId) {
    return next(new AppError('You are not the owner of this Comment', 403));
  }
  next();
};

const protectGetAll = (req, res, next) => {
  const { protecSession } = req;

  if (protecSession.role !== 'admin') {
    return next(new AppError('Invalid Role', 403));
  }
  next();
};

module.exports = {
  protecSession,
  protectUsersAccount,
  protectPost,
  protectComment,
  protectGetAll,
};
