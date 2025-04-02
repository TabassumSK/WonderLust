const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
// const wrapeAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const review = require('./models/review.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


//database connectivity
main()
.then((data) => {
    console.log("Database connected");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


//session
const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
};

// app.get("/", (req, res) => {
//     res.redirect('/listings');
// });  

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

//middleware for validating listing
// const validateListing = (req, res, next, err) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error) {
//         let errMas = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// //middleware for validating Review
// const validateReview = (req, res, next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

app.use("/listings", listingsRouter);  
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// //index route
// app.get("/listings", wrapeAsync(async (req, res) => {
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// }));

// //New route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// //show route
// app.get("/listings/:id", wrapeAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// }));

// //create route
// app.post("/listings",validateListing ,wrapeAsync(async (req, res, next) => {
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error) {
//         throw new ExpressError(400, result.error);
//     }
//         const listing = new Listing(req.body.listing);
//         await listing.save();
//         res.redirect("/listings");
//     })
// );


// //edit route
// app.get("/listing/:id/edit", wrapeAsync(async(req, res) => {
//     console.log(req.params);
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));

// //update route
// app.put("/listings/:id",validateListing, wrapeAsync(async (req, res) => {
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "Send Valid Data for listing");
//     // }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing })
//     res.redirect(`/listings/${id}`);
// }));

// //delete route
// app.delete('/listings/:id', wrapeAsync(async (req, res) => {
//     let {id} = req.params;
//     const deleteListing = await Listing.findByIdAndDelete(id);
//     console.log(deleteListing);
//     res.redirect("/listings"); 
// }));

// //Reviews
// //Post review route
// app.post("/listings/:id/reviews", validateReview, wrapeAsync (async(req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing.id}`);
// }));


// //Delete review route
// app.delete("/listings/:id/reviews/:reviewId", wrapeAsync(async (req, res) => {
//         let {id, reviewId} = req.params;
//         await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//         await Review.findByIdAndDelete(reviewId);
//         res.redirect(`/listings/${id}`);
//     })
// );


// if request matching above routes it will executed but if not find route then it will prints "Page Not Found"
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handling
app.use((err, req, res, next) => {
    let {statusCode = 500 ,message = "Something went Wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running at port 8080");
});