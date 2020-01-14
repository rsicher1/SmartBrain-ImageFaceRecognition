const express = require('express');
const router = express.Router();

const db = require('../database');
const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/auth');

router.get(
  '/token',
  authMiddleware.validateToken,
  authMiddleware.issueNewToken,
  authController.token
);

router.post('/signin', authController.signin);

router.post(
  '/register',
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const users = await db
        .select(1)
        .from('users')
        .where({ email });

      const existingUser = users[0];
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  authController.register
);

module.exports = router;
