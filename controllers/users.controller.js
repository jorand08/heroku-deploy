const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');

dotenv.config({ path: '/config.env' });

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

//Gen random jwt sings
//require('crypto').randomBytes(64).toString('hex') -> Enter into the node console paste the command

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content'],
        include: [{ model: Comment, include: [{ model: User }] }],
      },
      {
        model: Comment,
      },
    ],
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      users,
    },
  });
  next();
});

const createUsers = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== 'admin' && role !== 'normal') {
    return next(new AppError('invalid Role', 400));
  }

  //encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  //remove password
  newUser.password = undefined;

  res.status(201).json({
    status: 'sucess',
    data: { newUser },
  });
  next();
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { user } = req;

  // const updateUser = await user.update({name}, {where: {if}});
  await user.update({ name });

  res.status(200).json({
    status: 'sucess',
    data: { user },
  });
  next();
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'succes' });
  next();
});

const login = async (req, res, next) => {
  try {
    //get email and password from req.body
    const { email, password } = req.body;
    //Validate if the user exist with given email
    const user = await User.findOne({
      where: { email, status: 'active' },
    });
    //Compare password (entered password vs db password)
    //if user does´t  exists or passwords doesn't match, send error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Wrong credential', 400));
    }
    //Remove password from response
    user.password = undefined;
    // generate JWT (payload, secreteOrPrivateKey, options)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      status: 'sucess',
      data: { user, token },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  createUsers,
  updateUser,
  deleteUser,
  login,
};
