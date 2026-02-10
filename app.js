const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { wrap } = require("module");
const { listingSchema } = require("./schema.js");


main()
    .then((res) => {
        console.log("Connection successful to Db");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/Svietbnb");
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


app.get("/", (req, res) => {
    res.send("Root page");
});

//Joi 
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};


//Index route
app.get("/listings", validateListing, wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));


//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});


//Create route
app.post("/listings", wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Show route
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', { listing });
}));


//Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));


//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
}));

//destroy route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));




//testListing
// app.get("/testlisting", async (req,res) => {
//     let newListing =new Listing({
//         title: "Hotel PLaza",
//         description: "Deluxe, air conditioned double bed queen size room",
//         price : 5000,
//         location :"Sviet hostel j-block",
//         country :"India",
//     });

//     await newListing.save();
//     console.log("Sample data saved");
//     res.send("Successfull");
// });


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


//Error handling middleWares
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/Error.ejs", { message });
});



app.listen(1010, () => {
    console.log("Server is listening on port: 1010");
})