const db = require('../database');

const profile = (req, res, next) => {
  const { user, token } = req;

  res.json({
    token,
    message: 'Successfully fetched user',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined,
    },
  });
};

const image = async (req, res, next) => {
  const { user, token } = req;

  const updatedUser = await db('users')
    .returning('entries')
    .increment('entries')
    .where({ id: user.id });

  const userEntries = updatedUser[0];

  res.json({
    token,
    message: 'Successfully updated user entries',
    user: {
      entries: userEntries,
    },
  });
};

module.exports = { profile, image };
