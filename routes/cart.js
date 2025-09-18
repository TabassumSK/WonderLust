const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Cart page: Show booked listings
router.get("/", isLoggedIn, async (req, res) => {
    let bookedListings = await Listing.find({ booked: true });
    res.render("listings/cart.ejs", { bookedListings });
});

// Remove a booked listing from cart (set booked to false)
router.post("/:id/remove", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/cart");
    }
    listing.booked = false;
    await listing.save();
    req.flash("success", "Listing removed from cart!");
    res.redirect("/cart");
});



module.exports = router;
