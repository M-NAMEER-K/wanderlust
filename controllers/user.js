const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");
module.exports.signuser=async (req,res)=>{
    try{
        let {email,username , password}=req.body;
        const newUser=new User({
            email,username
        });
       const registeredUser=await User.register(newUser , password);
       req.login(registeredUser,(err)=>{
           if(err){
                 return next(err);
           }
            req.flash("success","New user was registered");
            res.redirect("/listings"); 
       });
      
    }
    catch(e){
               req.flash("error",e.message);
               res.redirect("/signup");
    }
    
}


module.exports.logoutuser=(req,res,next)=>{
      req.logout((err)=>{
          if(err){
            next(err);
          }
          req.flash("success","You are logged out");
          res.redirect("/listings");
      })
}