const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database');

const token = async (req, res, next) => {
  const users = await db
    .select('id', 'name', 'entries')
    .from('users')
    .where({ id: req.decodedUserId });
  const user = users[0];
  if (user) {
    return res.json({
      token: req.token,
      message: 'Successfully signed in',
      user: {
        id: user.id,
        name: user.name,
        entries: user.entries,
      },
    });
  }
  return res.json({
    message: 'User not found',
  });
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await db
      .select('u.id', 'l.email', 'l.hash', 'u.entries', 'u.name')
      .from('login as l')
      .join('users as u', function() {
        this.on({ 'u.id': 'l.userid' });
      })
      .where({ 'l.email': email });

    const user = users[0];

    if (user) {
      const validPassword = await bcrypt.compare(password, user.hash);
      if (validPassword) {
        const token = jwt.sign(
          {
            userId: user.id,
          },
          '()#*$()*#@_)(#JK@BHSJHDBSD*(&#@)@##',
          { expiresIn: '1h' }
        );
        return res.json({
          token,
          message: 'Successfully signed in',
          user: {
            id: user.id,
            name: user.name,
            entries: user.entries,
          },
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const register = async (req, res, next) => {
  const trx = await db.transaction();
  try {
    const { name, email, password } = req.body;

    const newUser = await trx
      .into('users')
      .returning('id')
      .insert({
        name,
        email,
        joined: new Date(),
      });

    const userid = newUser[0];

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    await trx.into('login').insert({ email, userid, hash });
    await trx.commit();
    res.json({
      message: 'Successfully registered',
    });
  } catch (err) {
    await trx.rollback();
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports = { signin, register, token };
