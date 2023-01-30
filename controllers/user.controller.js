const { dbUsers } = require('../models/user');
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const jimp = require('jimp');

const { JWT_SECRET } = require('../config');

async function signUp(req, res, next) {
  const { email, password } = req.body;
  const newUser = await dbUsers.findOne({ email });
  if (newUser) {
    throw Conflict('Email in use!');
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const savedUser = await dbUsers.create({
    email,
    password: hashedPassword,
    avatarURL:gravatar.url(email, {protocol: 'https'}),
  });

  return res.status(201).json({
    user: {
      email,
      subscription: savedUser.subscription,
     
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
  if (!user) {
    throw Unauthorized('Not authorized');
  }
  await dbUsers.findByIdAndUpdate(user._id, { token: null });
  return res.status(204).end();
}

async function current(req, res, next) {
  const user = req.user;
  if (!user) {
    throw Unauthorized('Not authorized');
  }

  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
}

async function updateUserSubscription(req, res, next) {
  const user = req.user;
  if (!user) {
    throw Unauthorized('Not authorized');
  }
  const { subscription } = req.body;
  await dbUsers.findByIdAndUpdate(user._id, { subscription });

  return res.status(200).json({
    email: user.email,
    subscription,
  });
}

async function updateUserAvatar(req, res, next) {
  let user = req.user;
  if (!user) {
    throw Unauthorized('Not authorized');
  }
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename)

  
  jimp.read(tmpPath)
  .then(avatar => {
    return avatar
      .resize(250, 250) 
      .write(publicPath); 
  })
  .catch(err => {
    throw err
  });
  
  await fs.unlink(tmpPath);
  
  user =  await dbUsers.findById(user.id)
  user.avatarURL = `/avatars/${filename}`
  await user.save()
 
 
  return res.status(200).json({
    avatarURL: `/avatars/${filename}`,
  });
}

module.exports = {
  signUp,
  login,
  logout,
  current,
  updateUserSubscription,
  updateUserAvatar,
};
