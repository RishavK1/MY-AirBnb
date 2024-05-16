// Import required packages and modules
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require('console');

// Define the MongoDB connection URL
const dbUrl = process.env.ATLASDB_URL;


mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server and listen on port 2000
    app.listen(2000, () => {
      console.log(`App is listening on port 2000`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Set the view engine to EJS and configure the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Enable URL-encoded request body parsing and method overriding
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Configure EJS to use ejsMate
app.engine("ejs", ejsMate);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  
  mongoUrl : dbUrl,
  crypto:{
    secret : process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error", ()=>{
  console.log("ERROR IN MONGO SESSION STORE",error);
})
// Configuring Sessions
const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

// Using Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Using locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Mount the routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).render("error.ejs", { message });
});
