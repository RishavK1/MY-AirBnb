const Listing = require("./models/listing"); // Model representing listings
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class
const { listingSchema, reviewSchema } = require("./schema.js"); // Schemas for validating listings and reviews
const Review = require("./models/review.js"); // Model representing reviews

// Middleware to check if a user is logged in
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // If the user is not authenticated
    req.session.redirectUrl = req.originalUrl; // Store the current URL to redirect after login
    req.flash("error", "You must be logged in!"); // Flash error message to the user
    return res.redirect("/login"); // Redirect to login page
  }
  next(); // If authenticated, proceed to the next middleware
};

// Middleware to save the redirect URL if it exists in the session
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    // Check if there is a redirect URL in the session
    res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in response locals
  }
  next(); // Proceed to the next middleware
};

// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract listing ID from request parameters
    const listing = await Listing.findById(id); // Find the listing by its ID

    if (!listing) {
      // If listing doesn't exist
      req.flash("error", "Listing not found!"); // Flash error message
      return res.redirect("/listings"); // Redirect to listings page
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
      // Check if the current user is the owner of the listing
      req.flash("error", "You are not the owner of this listing!"); // Flash error message
      return res.redirect(`/listings/${id}`); // Redirect to the listing page
    }

    // If user is the owner, proceed to the next middleware
    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err); // Log the error to the console
    req.flash("error", "Something went wrong!"); // Flash general error message
    res.redirect("/listings"); // Redirect to listings page
  }
};

// Middleware to validate the listing data based on the schema
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate request body against listing schema
  if (error) {
    // If validation fails
    let errMsg = error.details.map((el) => el.message).join(","); // Concatenate error messages
    throw new ExpressError(400, errMsg); // Throw a custom error with status 400 and the error message
  } else {
    next(); // If validation passes, proceed to the next middleware
  }
};

// Middleware to validate the review data based on the schema
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // Validate request body against review schema
  if (error) {
    // If validation fails
    let errMsg = error.details.map((el) => el.message).join(","); // Concatenate error messages
    throw new ExpressError(400, errMsg); // Throw a custom error with status 400 and the error message
  } else {
    next(); // If validation passes, proceed to the next middleware
  }
};

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; // Extract listing ID and review ID from request parameters
  let review = await Review.findById(reviewId); // Find the review by its ID
  if (!review.author.equals(res.locals.currUser._id)) {
    // Check if the current user is the author of the review
    req.flash("error", "You are not the author of this review!"); // Flash error message
    return res.redirect(`/listings/${id}`); // Redirect to the listing page
  }
  next(); // If the user is the author, proceed to the next middleware
};
