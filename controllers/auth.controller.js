const { dbUsers } = require('../models/user')
const { Conflict } = require("http-errors");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function signUp (req, res, next) {
    const {email, password} = req.body
    const newUser = await dbUsers.findOne({email});
    if (newUser) {
        throw Conflict("Email in use!");
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const savedUser = await dbUsers.create({
        email,
        password: hashedPassword,
    })


    return res.status(201).json({
        user:{
            id: savedUser._id,
            email,
            subscription:savedUser.subscription,
            
        }
    });
  }
  


module.exports = {
    signUp
  };
  