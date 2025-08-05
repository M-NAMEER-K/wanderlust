const Listing =require("../models/listing.js");
const mongoose = require('mongoose');
const initData =require("./data.js");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

MONGODB_URL=process.env.DATABASE_URL;
   async function main(){
     await mongoose.connect(MONGODB_URL);
    await  initDB();
   }

   const initDB= async ()=>{
    await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({...obj,owner:'68919ddb476a88a8107ea106'}));
    await Listing.insertMany(initData.data);
    console.log("data is initialised");
   };

main()
.then(()=>{
  console.log("Database connected successfully");
})
.catch((err)=>{
  console.error(err);
});