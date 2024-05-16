// Import the required packages and modules
const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

// Define the MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnb2";

// Connect to the MongoDB database using the defined URL
main()
  .then((res) => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Define the main function to handle the connection promise
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize the database by deleting all existing listings and inserting the initial data
const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "663f0f745b5889e5162c2ef1",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data init...");
};

initDb();
