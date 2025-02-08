const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLogedIn, isOwner, validateListing } = require("../middleware.js");

const listingControllers = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLogedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllers.createListing)
  );
 
 

router.get("/new", isLogedIn, listingControllers.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingControllers.showListing))
.put(
  isLogedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingControllers.updateListing)
)
.delete(
  isLogedIn,
    isOwner,

  wrapAsync(listingControllers.deleteListing)
);  

// Define the EDIT route to fetch and render a specific listing for editing
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);


module.exports = router; // Export the Express app
