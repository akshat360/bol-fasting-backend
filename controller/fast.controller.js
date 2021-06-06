const Fast = require('../models/fast.model');
const Users = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.createFast = (req, res) => {
  try {
    const fast = new Fast(req.body);
    fast.fastState = 'started';
    const token = jwt.sign({ id: fast._id }, config.secret, {
      expiresIn: 3600 * parseInt(req.body.totalFastingTime),
    });

    fast.token = token;
    fast.save((err, data) => {
      if (!err && data) {
        Users.findById(req.body.userId).exec((err, user) => {
          user.fasts.unshift(fast._id);
          user.save();

          if (!err && user) {
            return res.status(200).json({
              message: 'Fast Started',
              status: true,
              user,
              fast,
            });
          } else
            return res.status(200).json({
              message: 'User not found',
              status: false,
            });
        });
      } else
        return res.status(200).json({
          message: 'Server Error',
          status: false,
        });
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server Error',
      status: false,
    });
  }
};
exports.updateFast = (req, res) => {};

exports.endFast = (req, res) => {
  try {
    const { fastId, fastingTime } = req.body;
    Fast.findById(fastId).exec((err, fast) => {
      const now = new Date();

      delete fast.token;
      fast.fastState = 'ended';
      fast.endedAt = now;
      fast.fastingTime = fastingTime;
      fast.save();

      if (!err && fast) {
        return res.status(200).json({
          message: 'Fast Ended',
          status: true,
          data: fast,
        });
      } else
        return res.status(200).json({
          message: 'Fast log not found',
          status: false,
        });
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server Error',
      status: false,
    });
  }
};

exports.getUserAllFasts = (req, res) => {
  const { userId } = req.body;
  console.log('getUserAllFasts', userId);

  Users.findById(userId)
    .populate('fasts')
    .exec((err, user) => {
      console.log('getUserAllFasts', err, user);
      if (!err && user) {
        return res.status(200).json({
          message: 'fasts fetched',
          data: user,
          status: true,
        });
      } else
        return res.status(400).json({
          message: 'fasts fetching failed',
          status: false,
        });
    });
};

exports.getFast = (req, res) => {
  const { fastId } = req.body;

  Fast.findById(fastId).exec((err, fast) => {
    if (!err && fast) {
      jwt.verify(fast.token, config.secret, (err, decoded) => {
        return res.status(200).json({
          message: 'Timer Error',
          decoded: decoded,
          status: true,
        });
      });
    }
  });
};

exports.getCurrentFast = (req, res) => {
  try {
    const { userId } = req.body;
    Users.findById(userId).exec((err, user) => {
      if (!err && user) {
        if (user.fasts.length > 0) {
          Fast.findById(user.fasts[0]._id).exec((err, fast) => {
            let fast1 = new Fast(fast);

            if (!err && fast1) {
              jwt.verify(fast1.token, config.secret, (err, decoded) => {
                if (!decoded && err) {
                  fast1.fastingTime = fast1.totalFastingTime;
                  fast1.fastState = 'ended';
                  fast1.endedAt = fast1.endingAt;
                  delete fast1.token;
                  fast1.save();
                  return res.status(200).json({
                    message: 'Token Expired ',
                    decoded,
                    err,
                    data: {
                      fastState: 'initial',
                    },
                    status: false,
                  });
                } else
                  return res.status(200).json({
                    message: 'fast data',
                    decoded,
                    err,
                    data: fast1,
                    status: true,
                  });
              });
            }
          });
        } else
          return res.status(404).json({
            message: 'No Fasts',
            status: false,
          });
      } else
        return res.status(404).json({
          message: 'No user',
          status: false,
        });
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server Error',
      status: false,
    });
  }
};

// };
