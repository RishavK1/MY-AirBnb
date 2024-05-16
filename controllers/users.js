const User = require("../models/user");


module.exports.renderSignUpForm =  (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.SignUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome To AirBnb");
        res.redirect("/listings");
      })
      
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
  }
  
module.exports.Login = async(req, res)=>{
    req.flash("success", "Welcome back to AirBnb");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }  

module.exports.Logout = (req, res,  next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "You have logged out! ");
      res.redirect("/listings");
    })
  }  