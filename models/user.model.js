const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: { type: String, lowercase: true, trim: true },
  lastName: { type: String, lowercase: true, trim: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },

  fasts: [{ type: Schema.Types.ObjectId, ref: 'Fast' }],
});

// Methods
userSchema.methods.generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

userSchema.methods.validatePassword = (password, currentPassword) => {
  return bcrypt.compareSync(password, currentPassword);
};

module.exports = mongoose.model('Users', userSchema);
