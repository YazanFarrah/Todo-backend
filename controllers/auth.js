const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function handleErrors(e, next) {
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  next(e);
}

exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // errors.data can send to the front end the exact error
      errors.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ msg: "User created.", userId: user._id });
  } catch (e) {
    handleErrors(e, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("A user with this email doesn't exist");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },

      process.env.JWT_SECRET
    );
    console.log(token);
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (e) {
    handleErrors(e, next);
  }
};
