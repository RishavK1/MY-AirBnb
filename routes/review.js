const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
const {validateReview, isLogedIn, isReviewAuthor} = require("../middleware.js");
const { newReview, deleteReview } = require("../controllers/review.js");

  
// Define the REVIEW route to handle listing review
router.post(
    "/",
    isLogedIn,
    validateReview,
     wrapAsync( newReview));
  
  // Define the  DELETE REVIEW route to handle delete  review
  router.delete(
    "/:reviewId",
    isLogedIn,
    isReviewAuthor,
   wrapAsync(deleteReview));
  
  module.exports = router;