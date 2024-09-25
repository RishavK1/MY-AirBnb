const Listing = require("../models/listing"); // Import the Listing model to interact with listings in the database
const Review = require("../models/review"); // Import the Review model to interact with reviews in the database

// Handle the creation of a new review
module.exports.newReview = async (req, res) => {
  // Find the listing by its ID from the request parameters
  let listing = await Listing.findById(req.params.id);

  // Create a new Review instance using the review data from the request body
  let newReview = new Review(req.body.review);

  // Set the author of the review to the currently logged-in user
  newReview.author = req.user._id;

  // Add the new review to the reviews array of the listing
  listing.reviews.push(newReview);

  // Save the new review and the updated listing to the database
  await newReview.save();
  await listing.save();

  // Flash a success message after adding the review
  req.flash("success", "New Review Added!");

  // Redirect to the listing's page to show the newly added review
  res.redirect(`/listings/${listing._id}`);
};

// Handle the deletion of a review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params; // Extract the listing ID and review ID from the request parameters

  // Find the listing by ID and remove the review from the reviews array using the $pull operator
  Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review from the database by its ID
  await Review.findByIdAndDelete(reviewId);

  // Flash a success message after deleting the review
  req.flash("success", "Review Deleted!");

  // Redirect back to the listing's page after the review is deleted
  res.redirect(`/listings/${id}`);
};
