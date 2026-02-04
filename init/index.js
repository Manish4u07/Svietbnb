const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

main()
    .then((res) => {
        console.log("Connection successful to Db");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Svietbnb");
}

const intiDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was intialized");
}

intiDb();