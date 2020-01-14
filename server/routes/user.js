const express = require('express');
const router = express.Router();

const db = require('../database');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

const findUser = async (req, res, next) => {
  const users = await db
    .select('*')
    .from('users')
    .where({ id: req.userId });
  const user = users[0];
  req.user = user;
  next();
};

const handleFindUserError = (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  next();
};

const handleWrongUserError = (req, res, next) => {
  if (req.userId !== req.decodedUserId) {
    return res
      .status(403)
      .json({ message: 'Not authorized to perform this operation' });
  }
  next();
};

router.get(
  '/profile/:id',
  (req, res, next) => {
    req.userId = +req.params.id;
    next();
  },
  findUser,
  handleFindUserError,
  authMiddleware.validateToken,
  handleWrongUserError,
  authMiddleware.issueNewToken,
  userController.profile
);

router.put(
  '/image',
  (req, res, next) => {
    req.userId = +req.body.id;
    next();
  },
  findUser,
  handleFindUserError,
  authMiddleware.validateToken,
  handleWrongUserError,
  authMiddleware.issueNewToken,
  userController.image
);

module.exports = router;
