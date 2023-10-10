const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const authController = require("../controllers/auth");

const User = require("../models/user");
const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-mail address already exists!");
        }
      })
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please enter at least 6 characters password"),
    body("name").trim().notEmpty(),
  ],
  authController.signUp
);

router.post("/login", authController.login);
module.exports = router;
