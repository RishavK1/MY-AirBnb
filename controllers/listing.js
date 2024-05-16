const Listing = require("../models/listing");
const mbxGecoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGecoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings;
    const searchTerm = req.query.search;
    if (searchTerm) {
        allListings = await Listing.find({ title: { $regex: new RegExp(searchTerm, 'i') } });
    } else {
        allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs", { allListings, searchTerm });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path :"reviews", populate : {
        path : "author",
      },})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}
// Route handler to render the edit page
module.exports.editListing= async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    // Ensure the image URL is correct and remove any spaces
    let originalImageUrl = listing.image.url;
    if (originalImageUrl) {
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300").replace(/\s/g, '');
    }
    res.render("listings/edit", { listing, originalImageUrl });
  } catch (e) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}
