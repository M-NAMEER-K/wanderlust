const express=require("express");
const router=express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const {signuser,logoutuser}=require("../controllers/user");

router.get("/signup",(req,res)=>{
          res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(signuser));

router.get("/login",(req,res)=>{
     res.render("users/login");
});

router.post("/login",saveRedirectUrl,passport.authenticate('local', {failureRedirect:"/login",failureFlash:true}), async(req,res)=>{
     req.flash("success","welcome to wanderlust");
     let redirectUrl=res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
});

//logout user
router.get("/logout",logoutuser);



module.exports=router;