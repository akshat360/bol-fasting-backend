const Fast = require('../models/fast.model');
const Users = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.createFast = (req, res) => {
  try {
    console.log('createFast', req.body);

    const fast = new Fast(req.body);

    const token = jwt.sign({ id: fast._id }, config.secret, {
      expiresIn: 3600 * parseInt(req.body.totalFastingTime), // expires in 24 hours
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
    const { fastId } = req.body;
    Fast.findById(fastId).exec((err, fast) => {
      fast.fastState = 'ended';
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
