const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");
const ExpressError = require("../utils/ExpressError");
   require("dotenv").config();
module.exports.create=async (req,res)=>{
      const { title, description,image,price,country,location}=req.body;
     
         if(!title || !description  || !price || !country || !location ){
            throw new ExpressError(400,"Send Valid data for listing");
         }
         let url=req.file.path;
         let filename= req.file.filename;

      const listing=new Listing({
        title,description,image,price,location,country
      });
       listing.owner=req.user._id;
       listing.image={url,filename};
       await listing.save()
       .then(()=>{
         req.flash("success","New listing created!");
        console.log("Listing is created");
       })
       .catch((err)=>{
         console.log(err);
       });

       res.redirect("/listings");
        
}

module.exports.show=async (req, res)=>{
         let {id}=req.params;
         
       const listing= await Listing.findById(id).populate({  path : "reviews" , populate : {path : "author"}}).populate("owner");
       
       if(!listing){
          req.flash("error","Listing does not exist!");
          res.redirect("/listings");
       }
        console.log(listing.image);
        
       res.render("listings/show.ejs",{listing});
}

module.exports.editget=async (req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id);
       if(!listing){
          req.flash("error","Listing does not exist!");
          res.redirect("/listings");
       }
       let originalImageUrl = listing.image.url;
         originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
         res.render("listings/edit.ejs",{listing,originalImageUrl});       
}

module.exports.editpost=async(req,res)=>{
       const {title,image,description,price,location,country}=req.body;
       const {id}=req.params;

        const updatedlisting= await Listing.findByIdAndUpdate(id,{title,image,description,price,location,country}
            ,{new:true,runValidators:true}
        );
        if(typeof req.file!=="undefined"){
          let url=req.file.path;
         let filename= req.file.filename;
          updatedlisting.image={url,filename};
            await updatedlisting.save();}
         req.flash("success","Listing is Updated");
        res.redirect(`/listings/${id}`);
}

module.exports.del=async (req,res)=>{
              const {id}=req.params;
             let data=  await Listing.findByIdAndDelete(id);
             console.log("Deleted data: ",data);
             req.flash("success","Listing is deleted");
               res.redirect("/listings");
}

module.exports.index=async (req,res)=>{
                 
        const allListings=await Listing.find({});
       
        res.render("listings/index.ejs",{allListings});

 }
 module.exports.indexFilter=async (req,res)=>{
          const { country } = req.body;

    if (!country) {
        req.flash("error", "Please enter a country to search.");
        return res.redirect("/listings");
    }
     const listings = await Listing.find({ country: country.trim()});

       if (listings.length === 0) {
        req.flash("error", `No listings found for "${country}".`);
        return res.redirect("/listings");
    }

     res.render("listings/index.ejs", { allListings: listings });

 }

 module.exports.indexByCategory = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    req.flash("error", "No category selected.");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({ category: type });

  if (listings.length === 0) {
    req.flash("error", `No listings found for "${type}" category.`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings: listings });
};
