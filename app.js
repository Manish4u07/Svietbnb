const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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

//Index route
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});


//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});


//Create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


//Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', { listing });
});


//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});


//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
});

//destroy route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

});


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



app.listen(1010, () => {
    console.log("Server is litening on port: 1010");
})