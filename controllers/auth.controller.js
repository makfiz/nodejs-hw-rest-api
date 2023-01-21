const { dbUsers } = require('../models/user');
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
  const isTheSame = await bcrypt.compare(password, user.password);
  if (!isTheSame) {
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

module.exports = {
  signUp,
  login,
};
