const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(
      token,
      '()#*$()*#@_)(#JK@BHSJHDBSD*(&#@)@##'
    );

    if (!decodedToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.authError = null;
    req.decodedUserId = decodedToken.userId;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const issueNewToken = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(
      token,
      '()#*$()*#@_)(#JK@BHSJHDBSD*(&#@)@##'
    );

    if (!decodedToken) {
      return next();
    }

    req.token = jwt.sign(
      {
        userId: decodedToken.userId,
      },
      '()#*$()*#@_)(#JK@BHSJHDBSD*(&#@)@##',
      { expiresIn: '1h' }
    );
    req.decodedUserId = decodedToken.userId;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next();
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { validateToken, issueNewToken };
