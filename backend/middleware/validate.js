const { validationResult, body } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Validation failed', errors.array());
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const postRules = [
  body('content').trim().notEmpty().withMessage('Post content is required').isLength({ max: 500 }),
];

const commentRules = [
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 300 }),
];

module.exports = { handleValidation, registerRules, loginRules, postRules, commentRules };
