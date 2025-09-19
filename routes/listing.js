const express = require("express");
const router = express.Router();
const wrapeAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { listingSchema } = require("../schema.js");
 

//index route
router.get("/", wrapeAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapeAsync(async (req, res) =>  {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                },
            })
            .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

//create route
router.post("/", isLoggedIn, validateListing ,wrapeAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error) {
        throw new ExpressError(400, result.error);
    }

     // Ensure image is an object
    let { image } = req.body.listing;
    if (typeof image === "string") {
        req.body.listing.image = {
            url: image, // Assign the URL from form input
            filename: "uploaded_image" // Placeholder filename
        };
    } 

        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id;
        await listing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapeAsync(async(req, res) => {
    console.log(req.params);
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapeAsync(async (req, res) => {
    let {id} = req.params;
    // Ensure that `image` is an object
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = { url: req.body.listing.image };
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete('/:id',isLoggedIn, isOwner, wrapeAsync(async (req, res) => {
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings"); 
}));


router.post("/:id/book", isLoggedIn, wrapeAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    listing.booked = true; // Mark listing as booked
    await listing.save();

    req.flash("success", "Listing booked successfully!");
    res.redirect("/cart"); // Redirect to cart page
}));

module.exports = router;