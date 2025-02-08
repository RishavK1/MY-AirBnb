const Listing = require("../models/listing"); // Import the Listing model to interact with listings in the database
const mbxGecoding = require("@mapbox/mapbox-sdk/services/geocoding"); // Import Mapbox Geocoding service
const mapToken = process.env.MAP_TOKEN; // Access the Mapbox token from environment variables
const geocodingClient = mbxGecoding({ accessToken: mapToken }); // Initialize the Mapbox geocoding client

// Display all listings, with an optional search functionality
module.exports.index = async (req, res) => {
  let allListings;
  const searchTerm = req.query.search; // Get the search term from the query parameters
  if (searchTerm) {
    // Find listings that match the search term using a case-insensitive regex
    allListings = await Listing.find({
      title: { $regex: new RegExp(searchTerm, "i") },
    });
  } else {
    // If no search term, fetch all listings
    allListings = await Listing.find({});
  }
  // Render the index.ejs view and pass in allListings and searchTerm
  res.render("./listings/index.ejs", { allListings, searchTerm });
};

// Render the form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs"); // Renders the new.ejs form for creating a new listing
};

// Show a specific listing, including reviews and owner information
module.exports.showListing = async (req, res) => {
  let { id } = req.params; // Extract the listing ID from the request parameters
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews", // Populate the reviews for the listing
      populate: {
        path: "author", // For each review, also populate the author's information
      },
    })
    .populate("owner"); // Populate the owner information of the listing

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!"); // Flash an error message if the listing is not found
    return res.redirect("/listings"); // Redirect to listings if not found
  }

  // Render the show.ejs view for the specific listing
  res.render("./listings/show.ejs", { listing });
};

// Create a new listing with geocoding for the location and image upload
module.exports.createListing = async (req, res, next) => {
  // Get the geocoding data for the listing's location from Mapbox
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location, // Use the location from the form data
      limit: 1,
    })
    .send();

  // Extract the image URL and filename from the uploaded file
  let url = req.file.path;
  let filename = req.file.filename;

  // Create a new Listing instance with the form data
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Set the owner of the listing to the current logged-in user
  newListing.image = { url, filename }; // Add the uploaded image
  newListing.geometry = response.body.features[0].geometry; // Add the geocoded geometry for the location

  let savedListing = await newListing.save(); // Save the new listing to the database
  req.flash("success", "New Listing Created!"); // Flash a success message

  res.redirect("/listings"); // Redirect to the listings page
};

// Render the form to edit a listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params; // Extract the listing ID from the request parameters
  try {
    const listing = await Listing.findById(id); // Find the listing by ID
    if (!listing) {
      req.flash("error", "Cannot find that listing!"); // Flash an error if the listing doesn't exist
      return res.redirect("/listings");
    }
    // Ensure the image URL is correct and remove any spaces for resizing the image
    let originalImageUrl = listing.image.url;
    if (originalImageUrl) {
      originalImageUrl = originalImageUrl
        .replace("/upload", "/upload/h_300,w_300")
        .replace(/\s/g, "");
    }

    // Render the edit.ejs view, passing the listing and the adjusted image URL
    res.render("listings/edit", { listing, originalImageUrl });
  } catch (e) {
    req.flash("error", "Something went wrong!"); // Flash an error message on failure
    res.redirect("/listings");
  }
};

// Update a listing's details
module.exports.updateListing = async (req, res) => {
  let { id } = req.params; // Extract the listing ID from the request parameters
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing with new form data

  if (typeof req.file !== "undefined") {
    // If a new file is uploaded, update the listing's image
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); // Save the updated listing
  }

  req.flash("success", "Listing Updated!"); // Flash a success message
  res.redirect(`/listings/${id}`); // Redirect to the updated listing's page
};

// Delete a listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params; // Get listing ID from params

    let deletedListing = await Listing.findByIdAndDelete(id); // Delete the listing

    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!"); // Flash success message
    res.redirect("/listings"); // Redirect after deletion
};


