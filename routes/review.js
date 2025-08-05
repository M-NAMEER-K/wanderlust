const express=require("express");
const router = express.Router({ mergeParams: true });

const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError =require("../utils/ExpressError");
const Review=require("../models/review.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const {postreview,delreview} =require("../controllers/review.js");
// reviews post route
router.post("/",isLoggedIn,postreview);


//delete review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(delreview));

module.exports=router;