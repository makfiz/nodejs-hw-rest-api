const { dbUsers } = require('../models/user');
const { Conflict, Unauthorized, NotFound } = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET } = require('../config');

const { verificationTokenSender } = require('../helpers');

async function signUp(req, res, next) {
  const { email, password } = req.body;
  const newUser = await dbUsers.findOne({ email });
  if (newUser) {
    throw Conflict('Email in use!');
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = uuidv4();

  await dbUsers.create({
    email,
    password: hashedPassword,
    verificationToken,
    avatarURL: gravatar.url(email, { protocol: 'https' }),
  });

  const sendEmailInfo = await verificationTokenSender(email, verificationToken);

  const sendEmailInfoMsg = sendEmailInfo.response.includes('250 OK')
    ? 'An email has been sent to the email address you provided to verify your account.'
    : 'Sorry, we were unable to send an email to the email address you provided to verify your account.';

  return res.status(201).json({
    info: sendEmailInfoMsg,
    user: {
      email,
      subscription: 'starter',
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await dbUsers.findOne({ email });

  if (!user) {
    throw Unauthorized('Email is wrong');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw Unauthorized('Password is wrong');
  }

  if (!user.verify) {
    throw Unauthorized('Email is not verify');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  await dbUsers.findByIdAndUpdate(user._id, { token });
  return res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
}

async function logout(req, res, next) {
  const user = req.user;

  await dbUsers.findByIdAndUpdate(user._id, { token: null });
  return res.status(204).end();
}

async function current(req, res, next) {
  const user = req.user;

  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
}

async function updateUserSubscription(req, res, next) {
  const user = req.user;

  const { subscription } = req.body;
  await dbUsers.findByIdAndUpdate(user._id, { subscription });

  return res.status(200).json({
    email: user.email,
    subscription,
  });
}

async function updateUserAvatar(req, res, next) {
  let user = req.user;

  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, '../tmp', filename);
  const publicPath = path.resolve(__dirname, '../public/avatars', filename);

  jimp
    .read(tmpPath)
    .then(avatar => {
      return avatar.resize(250, 250).write(publicPath);
    })
    .catch(err => {
      throw err;
    });

  await fs.unlink(tmpPath);

  user = await dbUsers.findById(user.id);
  user.avatarURL = `/avatars/${filename}`;
  await user.save();

  return res.status(200).json({
    avatarURL: `/avatars/${filename}`,
  });
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;
  const user = await dbUsers.findOne({ verificationToken });

  if (!user) {
    throw NotFound('User not found');
  }

  user.verificationToken = null;
  user.verify = true;
  await user.save();
  return res.status(200).json({
    message: 'Verification successful',
  });
}

async function reVerification(req, res, next) {
  const { email } = req.body;
  const user = await dbUsers.findOne({ email });

  if (!user) {
    throw NotFound('User not found');
  }

  if (user.verify) {
    return res.status(400).json({
      message: 'Verification has already been passed',
    });
  }

  if (!user.verify) {
    const sendEmailInfo = await verificationTokenSender(
      email,
      user.verificationToken
    );

    const sendEmailInfoStatus = sendEmailInfo.response.includes('250 OK')
      ? 200
      : 500;

    const sendEmailInfoMsg = sendEmailInfo.response.includes('250 OK')
      ? 'Verification email sent'
      : `${sendEmailInfo.error.message}`;

    return res.status(sendEmailInfoStatus).json({
      message: sendEmailInfoMsg,
    });
  }
}

module.exports = {
  signUp,
  login,
  logout,
  current,
  updateUserSubscription,
  updateUserAvatar,
  verify,
  reVerification,
};
