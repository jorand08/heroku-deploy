const { body, validationResult } = require('express-validator');

//utils
const { AppError } = require('../utils/appError.util');

const checkvalidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join('. ');
    return next(new AppError(message, 400));
  }
  next();
};

const createUserValidators = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name most be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password most be at least 3 characters'),
  checkvalidations,
];

const createPostValidators = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Title most be at least 3 characters'),
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Content most be at least 3 characters'),
  checkvalidations,
];

module.exports = { createUserValidators, createPostValidators };
