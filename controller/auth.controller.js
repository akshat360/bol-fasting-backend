const Users = require('../models/user.model');

exports.signup = (req, res) => {
  try {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    // Check if the password and confirm password fields match
    if (password === confirmPassword) {
      // Check if user with the same email is also registered
      Users.find({ email }).exec((err, user) => {
        if (err) {
          return res.status(404).json({
            message: 'User already registered.',
            status: false,
          });
        }
      });

      let user = new Users({ email, firstName, lastName });

      user.password = user.generateHash(password);

      user.save((err, user) => {
        console.log('user', err);
        if (!err)
          return res.status(200).json({
            message: 'Registration Complete.',
            status: true,
            data: user,
          });
        return res.status(404).json({
          message: "Can't Register right now.",
          status: false,
          error: err,
        });
      });
    } else {
      return res.status(404).json({
        message: 'Password does not match.',
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server Error',
      status: false,
    });
  }
};

exports.signin = (req, res) => {
  try {
    const { email, password } = req.body;
    Users.findOne({ email }).exec((err, user) => {
      if (user && !err) {
        let user1 = new Users(user);
        if (user1) {
          if (user1.validatePassword(password, user1.password))
            return res.status(200).json({
              message: 'Login Successfully.',
              status: true,
              data: user1,
            });
          else {
            return res.status(404).json({
              message: "Password don't match.",
              status: false,
            });
          }
        } else {
          return res.status(404).json({
            message: 'Invalid email or password.',
            status: false,
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server Error',
      status: false,
    });
  }
};
