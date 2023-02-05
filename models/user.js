const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verificationToken: {
      type: String,
      required: function () {
        return (
          typeof this.verificationToken === 'undefined' ||
          (this.verificationToken !== null &&
            typeof this.verificationToken !== 'string')
        );
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    minimize: false,
  }
);
mongoose.Schema.Types.String.checkRequired(
  verificationToken => verificationToken != null
);
const dbUsers = mongoose.model('users', schema);

module.exports = {
  dbUsers,
};
