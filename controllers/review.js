const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");
module.exports.postreview= async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    const { rating, comments } = req.body;

    // Validate input
    if (!rating || !comments || comments.trim() === '') {
      throw new ExpressError(400, "Send valid data for review");
    }
     
    const newReview = new Review({
      rating,
      comment: comments,
    });


        newReview.author=req.user._id;
        

    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();

    console.log("Review is saved");
     req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
}

module.exports.delreview=async (req,res)=>{
    let {id,reviewId}=req.params;

     await Listing.findByIdAndUpdate(id , { $pull:{reviews : reviewId}});
         await Review.findByIdAndDelete(reviewId);
          req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
}