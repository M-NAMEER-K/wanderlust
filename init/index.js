const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

require("dotenv").config({ path: "./.env" }); // Load env vars

console.log(process.env.GAPI); // should print the string
console.log("Type:", typeof process.env.DATABASE_URL); // should be "string"
/*main()
.then(()=>{
    console.log("DB connected successfully");
})
.catch((err)=>{
    console.log("Error in connecting the database");
    console.error(err);
});


   async function main(){
     await mongoose.connect(MONGODB_URL);
    await  initDB();
   }

   const initDB= async ()=>{
    await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({...obj,owner:'688f145c0b1b195f0db9133a'}));
    await Listing.insertMany(initData.data);
    console.log("data is initialised");
   };

*/