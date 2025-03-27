const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Cart page: Show booked listings
router.get("/", isLoggedIn, async (req, res) => {
    let bookedListings = await Listing.find({ booked: true });
    res.render("listings/cart.ejs", { bookedListings });
});

module.exports = router;
