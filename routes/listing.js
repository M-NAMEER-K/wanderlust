const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync");
const ExpressError =require("../utils/ExpressError");
const {isLoggedIn,isOwner}=require("../middleware.js");
const {create,show,editget,editpost,del,index,indexFilter,indexByCategory} = require("../controllers/listing.js");
const { storage}=require("../cloudConfig.js");


const multer  = require('multer')
const upload = multer({ storage })

 
router.get("/category", wrapAsync(indexByCategory));
//New Route
 router.get("/new",isLoggedIn,(req,res)=>{
         
    res.render("listings/new.ejs");
 });

router.post("/",isLoggedIn,upload.single("image"),wrapAsync(create));


  //Show Route
router.get("/:id",wrapAsync(show));

//Edit Route
router.get("/:id/edit", wrapAsync(editget));

router.put("/:id",isLoggedIn,isOwner,upload.single("image"),wrapAsync(editpost));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(del));


 router.get("/",wrapAsync(index));
 
 router.post("/search",wrapAsync(indexFilter));





 module.exports=router;