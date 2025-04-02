const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");


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

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner:"67def7edbeaa04d7f69fb168",}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();