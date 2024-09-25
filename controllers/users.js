const User = require("../models/user"); // Import the User model to interact with the database

// Render the signup form view
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs"); // Renders the signup.ejs view for user registration
};

// Handle user signup and registration
module.exports.SignUp = async (req, res) => {
  try {
    // Extract the username, email, and password from the request body
    let { username, email, password } = req.body;

    // Create a new User instance without saving it to the database yet
    const newUser = new User({ username, email });

    // Register the user with the hashed password using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // Log in the user automatically after registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // If there's an error during login, pass it to the error handler
      }
      req.flash("success", "Welcome To AirBnb"); // Flash a success message
      res.redirect("/listings"); // Redirect to the listings page after successful signup
    });
  } catch (e) {
    req.flash("error", e.message); // Flash an error message if signup fails
    res.redirect("/signup"); // Redirect back to the signup page on error
  }
};

// Render the login form view
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs"); // Renders the login.ejs view for user login
};

// Handle user login
module.exports.Login = async (req, res) => {
  req.flash("success", "Welcome back to AirBnb"); // Flash a success message after login

  // Redirect the user to the desired URL or to listings by default
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Handle user logout
module.exports.Logout = (req, res, next) => {
  req.logOut((err) => {
    // Log out the user using Passport's logout method
    if (err) {
      return next(err); // If there's an error during logout, pass it to the error handler
    }
    req.flash("success", "You have logged out!"); // Flash a success message after logout
    res.redirect("/listings"); // Redirect to the listings page after logout
  });
};
