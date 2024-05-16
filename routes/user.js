const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/users.js");

const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.route("/signup")
.get(userController.renderSignUpForm)
.post(
  wrapAsync(userController.SignUp)
);

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",    
    failureFlash: true,
  }),
  userController.Login
);

router.get("/logout",userController.Logout);


module.exports = router;
